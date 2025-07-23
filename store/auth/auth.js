// stores/auth.js
import { defineStore } from 'pinia'
import Keycloak from 'keycloak-js'
import axios from 'axios'
import { jwtDecode } from 'jwt-decode'
import Cookies from 'js-cookie'
import { useCookie } from '#app'
import { useAuthToken } from '~/composable/useAuthToken'

// Constants for inactivity management
const INACTIVITY_TIMEOUT = 4 * 60 * 60 * 1000 // 4 hours in milliseconds

export const useAuthKeycloakStore = defineStore('auth', {
  // State
  state: () => ({
    // Keycloak related
    strategy: 'keycloak',
    keycloak: null,
    user: null,
    loading: true,
    error: null,
    pkce_state: null,
    isAuthenticated: false,

    // API related
    getUsersData: [],
    tokenUserData: null,
    appIdUserData: null,
    accessTokenCookieValue: null,

    // Track initialization status
    isInitialized: false,

    // Track token refresh status
    isRefreshing: false,
    
    // User activity tracking
    lastUserActivity: Date.now(),
    isActive: true
  }),

  getters: {
    loggedIn: (state) => {
      try {
        // Avoid direct process.server check in getters
        const cookieToken = state.accessTokenCookieValue
        const keycloakToken = localStorage.getItem('auth._token.keycloak')
        const tokenExpiry = parseInt(localStorage.getItem('auth._token_expiration.keycloak') || '0')
        const isTokenExpired = Date.now() >= tokenExpiry
        const hasUser = state.user !== null

        return (
          state.isAuthenticated &&
          hasUser &&
          ((keycloakToken !== null && !isTokenExpired) ||
            (cookieToken ? true : false))
        )
      } catch (e) {
        // Handle case when localStorage is not available (server side)
        return false
      }
    },

    token: () => {
      try {
        return localStorage.getItem('auth._token.keycloak')?.replace('Bearer ', '')
      } catch (e) {
        return null
      }
    },

    refreshToken: () => {
      try {
        return localStorage.getItem('auth._refresh_token.keycloak')
      } catch (e) {
        return null
      }
    },

    // Get token expiration
    tokenExpiry: () => {
      try {
        return parseInt(localStorage.getItem('auth._token_expiration.keycloak') || '0')
      } catch (e) {
        return 0
      }
    },

    // Get refresh token expiration
    refreshTokenExpiry: () => {
      try {
        return parseInt(localStorage.getItem('auth._refresh_token_expiration.keycloak') || '0')
      } catch (e) {
        return 0
      }
    },

    // Check if token is expired
    isTokenExpired: () => {
      try {
        const expiry = parseInt(localStorage.getItem('auth._token_expiration.keycloak') || '0')
        return Date.now() >= expiry
      } catch (e) {
        return true
      }
    },

    // Get user roles
    roles: (state) => {
      if (!state.user || !state.user.realm_access) return []
      return state.user.realm_access.roles || []
    }
  },

  // Actions
  actions: {
    // Initialize Keycloak
    async initKeycloak() {
      // Don't initialize on server side
      if (process.server) return false

      // Avoid multiple initializations
      if (this.isInitialized && this.keycloak) return true

      this.loading = true

      try {
        // Get Keycloak configuration from server
        const keycloakConfig = await $fetch('/api/keycloak/config')
        
        // Validate keycloak configuration
        if (!keycloakConfig.keycloakBaseUrl || !keycloakConfig.keycloakClientId || !keycloakConfig.keycloakRealm) {
          throw new Error('Invalid Keycloak configuration received from server')
        }
        
        // Check localStorage first for existing tokens
        const token = localStorage.getItem('auth._token.keycloak')
        const refreshToken = localStorage.getItem('auth._refresh_token.keycloak')
        const tokenExpiry = parseInt(localStorage.getItem('auth._token_expiration.keycloak') || '0')

        // If we have valid tokens, try to use them first
        if (token && refreshToken && tokenExpiry > Date.now()) {
          try {
            // Parse token to get user info
            const tokenValue = token.replace('Bearer ', '')
            const decodedToken = JSON.parse(atob(tokenValue.split('.')[1]))
            this.user = decodedToken
            this.isAuthenticated = true

            // Get user data if needed (but don't redirect automatically)
            if (decodedToken.email) {
              localStorage.setItem('userEmail', decodedToken.email)
              await this.getUsers(true) // Skip redirect during initialization
            }

            // Create Keycloak instance for token refresh
            this.keycloak = new Keycloak({
              url: keycloakConfig.keycloakBaseUrl,
              realm: keycloakConfig.keycloakRealm,
              clientId: keycloakConfig.keycloakClientId
            })

            // Initialize Keycloak with token - disable iframe completely
            await this.keycloak.init({
              onLoad: 'check-sso',
              silentCheckSsoRedirectUri: keycloakConfig.keycloakRedirectUri + '/silent-check-sso.html',
              pkceMethod: 'S256',
              checkLoginIframe: false, // Disable iframe checks completely
              token: tokenValue,
              refreshToken: refreshToken,
              enableLogging: true,
              flow: 'standard' // Use standard flow instead of implicit
            })

            // Set up token refresh
            this.setupTokenRefresh()

            this.isInitialized = true
            return true
          } catch (error) {
            console.error('Failed to restore session from localStorage:', error)
            // Continue with normal initialization if restoring fails
            // DON'T clear tokens here, just try to initialize normally
          }
        }

        // Create Keycloak instance
        this.keycloak = new Keycloak({
          url: keycloakConfig.keycloakBaseUrl,
          realm: keycloakConfig.keycloakRealm,
          clientId: keycloakConfig.keycloakClientId
        })

        // Initialize Keycloak without iframe checks to avoid CSP issues
        const authenticated = await this.keycloak.init({
          onLoad: 'check-sso',
          silentCheckSsoRedirectUri: keycloakConfig.keycloakRedirectUri + '/silent-check-sso.html',
          pkceMethod: 'S256',
          checkLoginIframe: false, // Disable iframe checks completely
          enableLogging: true, // Enable logging for debugging
          flow: 'standard' // Use standard flow instead of implicit to avoid iframe issues
        })

        if (authenticated) {
          // Store tokens using token manager
          this.storeTokens(
            this.keycloak.token,
            this.keycloak.refreshToken,
            this.keycloak.tokenParsed.exp * 1000,
            this.keycloak.refreshTokenParsed.exp * 1000
          )

          // Parse user from token
          this.user = this.keycloak.tokenParsed
          this.isAuthenticated = true

          // Store email for API calls
          if (this.user && this.user.email) {
            localStorage.setItem('userEmail', this.user.email)

            // Fetch user data from API (but don't redirect automatically during init)
            await this.getUsers(true)
          }

          // Set up token refresh
          this.setupTokenRefresh()
        } else {
          // If not authenticated but we have tokens in localStorage, try to refresh them
          const token = localStorage.getItem('auth._token.keycloak')
          const refreshToken = localStorage.getItem('auth._refresh_token.keycloak')
          const tokenExpiry = parseInt(localStorage.getItem('auth._token_expiration.keycloak') || '0')

          if (token && refreshToken && tokenExpiry <= Date.now()) {
            // Token is expired, try to refresh it
            const refreshed = await this.manualTokenRefresh()
            if (refreshed) {
              // If token refresh was successful, fetch user data (skip redirect during init)
              const userEmail = localStorage.getItem('userEmail')
              if (userEmail) {
                await this.getUsers(true)
              }
              return true
            }
          }

          // If we still have valid tokens, consider the user authenticated
          if (token && tokenExpiry > Date.now()) {
            try {
              // Parse token to get user info
              const tokenValue = token.replace('Bearer ', '')
              const decodedToken = JSON.parse(atob(tokenValue.split('.')[1]))
              this.user = decodedToken
              this.isAuthenticated = true

              // Get user data if needed (skip redirect during initialization)
              if (decodedToken.email) {
                localStorage.setItem('userEmail', decodedToken.email)
                await this.getUsers(true)
              }

              return true
            } catch (error) {
              console.error('Failed to parse token:', error)
              // Don't clear tokens here, just return false
            }
          }
        }

        // Set up event listeners
        this.setupKeycloakEventListeners()

        this.isInitialized = true
        return authenticated
      } catch (error) {
        console.error('Failed to initialize Keycloak:', error)
        this.error = error.message
        // Don't clear tokens on initialization error
        return false
      } finally {
        this.loading = false
        this.setAccessTokenCookie()
      }
    },

    // Try to restore session from localStorage
    async restoreSession() {
      if (process.server) return false

      try {
        const token = localStorage.getItem('auth._token.keycloak')
        const refreshToken = localStorage.getItem('auth._refresh_token.keycloak')
        const tokenExpiry = parseInt(localStorage.getItem('auth._token_expiration.keycloak') || '0')

        if (!token || !refreshToken) {
          return false
        }

        if (tokenExpiry <= Date.now()) {
          // Token expired, try to refresh it
          const refreshed = await this.manualTokenRefresh()
          return refreshed
        }

        // Token still valid
        try {
          // Parse token to get user info
          const tokenValue = token.replace('Bearer ', '')
          const decodedToken = JSON.parse(atob(tokenValue.split('.')[1]))

          this.user = decodedToken
          this.isAuthenticated = true

          // Get user data if needed (skip redirect during restore session)
          if (decodedToken.email) {
            localStorage.setItem('userEmail', decodedToken.email)
            await this.getUsers(true)
          }

          return true
        } catch (error) {
          console.error('Failed to parse token:', error)
          return false
        }
      } catch (error) {
        console.error('Failed to restore session:', error)
        return false
      }
    },

    // Store tokens using token manager
    storeTokens(token, refreshToken, tokenExpiry, refreshTokenExpiry) {
      try {
        // Store tokens in localStorage
        localStorage.setItem('auth._token.keycloak', `Bearer ${token}`)
        localStorage.setItem('auth._token_expiration.keycloak', tokenExpiry.toString())
        localStorage.setItem('auth._refresh_token.keycloak', refreshToken)
        localStorage.setItem('auth._refresh_token_expiration.keycloak', refreshTokenExpiry.toString())
        localStorage.setItem('auth.strategy', 'keycloak')

        // Store in sessionStorage as backup
        sessionStorage.setItem('auth._token.keycloak', `Bearer ${token}`)

        // Also store in cookie for compatibility with existing code
        const expiresInDays = (tokenExpiry - Date.now()) / (1000 * 60 * 60 * 24)
        Cookies.set('access_token', token, { expires: expiresInDays > 0 ? expiresInDays : 1 })

        this.setAccessTokenCookie() // Update cookie state

        // Emit token change event via TokenManager to notify all components
        if (process.client && typeof window !== 'undefined') {
          console.log('Token refreshed, emitting tokenChange event')
          window.dispatchEvent(new CustomEvent('tokenChange', { 
            detail: { tokenType: 'keycloak', value: token, timestamp: Date.now() } 
          }))
        }

        console.log('Tokens stored successfully. Expiry:', new Date(tokenExpiry).toLocaleString())
      } catch (error) {
        console.error('Failed to store tokens:', error)
      }
    },

    clearTokens() {
      try {
        // Only clear tokens if we're explicitly logging out
        // Don't clear during refresh attempts
        if (this.isRefreshing) {
          console.log('Token refresh in progress, not clearing tokens')
          return
        }

        console.log('Clearing all authentication tokens...')

        // Clear Keycloak tokens
        localStorage.removeItem('auth._token.keycloak')
        localStorage.removeItem('auth._token_expiration.keycloak')
        localStorage.removeItem('auth._refresh_token.keycloak')
        localStorage.removeItem('auth._refresh_token_expiration.keycloak')
        localStorage.removeItem('auth.keycloak.pkce_state')

        // Clear OTP-related tokens (IMPORTANT FOR OTP FLOW)
        localStorage.removeItem('TokenInAuth')
        localStorage.removeItem('userId')
        localStorage.removeItem('userRole')
        localStorage.removeItem('appId')

        // Clear other user data
        localStorage.removeItem('userEmail')
        localStorage.removeItem('userToken')

        // Clear session storage
        sessionStorage.removeItem('auth._token.keycloak')
        sessionStorage.removeItem('TokenInAuth')
        sessionStorage.removeItem('userId')

        // Clear cookies
        const accessTokenCookie = useCookie('access_token')
        if (accessTokenCookie && accessTokenCookie.value) {
          accessTokenCookie.value = null
        }
        Cookies.remove('access_token')

        // Reset state
        this.user = null
        this.isAuthenticated = false
        this.getUsersData = []
        this.tokenUserData = null
        this.appIdUserData = null
        this.setAccessTokenCookie() // Clear cookie state

        console.log('Tokens cleared successfully')
      } catch (error) {
        console.error('Failed to clear tokens:', error)
      }
    },

    setupKeycloakEventListeners() {
      if (!this.keycloak) return

      this.keycloak.onAuthSuccess = async () => {
        console.log('Auth success')
        this.storeTokens(
          this.keycloak.token,
          this.keycloak.refreshToken,
          this.keycloak.tokenParsed.exp * 1000,
          this.keycloak.refreshTokenParsed.exp * 1000
        )
        this.user = this.keycloak.tokenParsed
        this.isAuthenticated = true

        // Store email for API calls
        if (this.user && this.user.email) {
          localStorage.setItem('userEmail', this.user.email)

          // Fetch user data from API (skip redirect to allow OTP flow)
          try {
            await this.getUsers(true)
          } catch (error) {
            console.warn('getUsers failed during auth success, continuing with flow:', error)
            // Don't block the auth flow if getUsers fails
          }
        }
      }

      this.keycloak.onAuthError = (error) => {
        console.error('Auth error:', error)
        // Don't clear tokens on auth error, might be temporary
      }

      this.keycloak.onAuthRefreshSuccess = () => {
        // Instead of using Keycloak's refresh mechanism, use our manual refresh
        // This ensures consistent behavior across all token refreshes
        this.manualTokenRefresh()
      }

      this.keycloak.onAuthRefreshError = (error) => {
        console.error('Auth refresh error:', error)
        this.isRefreshing = false
        
        // Clear refresh flags
        if (process.client) {
          sessionStorage.removeItem('token_refreshing')
        }
        
        // Try manual refresh as fallback
        this.manualTokenRefresh()
      }

      this.keycloak.onAuthLogout = () => {
        console.log('Auth logout')
        this.clearTokens()
      }

      this.keycloak.onTokenExpired = () => {
        console.log('Token expired')
        this.manualTokenRefresh()
      }
    },

    // Set up token refresh
    setupTokenRefresh() {
      if (process.server) return

      // Clear any existing interval
      if (window._tokenRefreshInterval) {
        clearInterval(window._tokenRefreshInterval)
      }
      
      // Set up activity listeners if not already set
      if (process.client && !window._userActivitySetUp) {
        console.log('Setting up user activity tracking')
        
        // Track user actions
        const activityEvents = ['mousedown', 'keydown', 'touchstart', 'scroll', 'mousemove']
        const activityHandler = () => this.updateUserActivity()
        
        activityEvents.forEach(event => {
          window.addEventListener(event, activityHandler, { passive: true })
        })
        
        // Record initial activity
        this.updateUserActivity()
        window._userActivitySetUp = true
      }

      // Refresh token before it expires - every 2 minutes
      window._tokenRefreshInterval = setInterval(() => {
        // First check if user has been inactive for too long
        if (this.checkUserInactivity()) {
          console.log('User inactive beyond timeout threshold, stopped token refresh')
          if (window._tokenRefreshInterval) {
            clearInterval(window._tokenRefreshInterval)
            window._tokenRefreshInterval = null
          }
          return
        }
        
        // Only refresh if token is still valid but will expire soon
        const tokenExpiry = parseInt(localStorage.getItem('auth._token_expiration.keycloak') || '0')
        const timeToExpiry = tokenExpiry - Date.now()

        // Refresh if token will expire in less than 5 minutes
        if (timeToExpiry > 0 && timeToExpiry < 5 * 60 * 1000) {
          // Only refresh if not already refreshing
          if (!this.isRefreshing) {
            console.log('Token expiring soon, performing manual refresh...')
            this.manualTokenRefresh()
          }
        }
      }, 2 * 60 * 1000) // Check every 2 minutes
    },

    // Refresh tokens (alias for manualTokenRefresh for backward compatibility)
    async refreshTokens() {
      return await this.manualTokenRefresh()
    },

    // Manual token refresh without keycloak instance
    async manualTokenRefresh() {
      // Prevent multiple refresh attempts
      if (this.isRefreshing) {
        console.log('Token refresh already in progress')
        return false
      }
      
      // Check for user inactivity before attempting refresh
      if (process.client) {
        // Check if user has been inactive beyond timeout
        const storedActivity = sessionStorage.getItem('lastUserActivity')
        const lastActivity = storedActivity ? parseInt(storedActivity) : this.lastUserActivity
        const inactiveTime = Date.now() - lastActivity
        
        if (inactiveTime >= INACTIVITY_TIMEOUT) {
          console.log(`Cancelling token refresh - User inactive for ${Math.floor(inactiveTime / 60000)} minutes`)
          
          // Log the user out due to inactivity
          this.isActive = false
          this.logout()
          return false
        }
      }

      this.isRefreshing = true
      console.log('Manual token refresh initiated at', new Date().toLocaleString())
      
      // Set flag in sessionStorage to indicate refresh in progress
      if (process.client) {
        sessionStorage.setItem('token_refreshing', 'true')
        // Clear any previously set token refreshed flag
        sessionStorage.removeItem('token_refreshed')
      }

      try {
        console.log('Attempting manual token refresh')
        const refreshToken = localStorage.getItem('auth._refresh_token.keycloak')
        if (!refreshToken) {
          console.error('No refresh token available')
          this.isRefreshing = false
          if (process.client) {
            sessionStorage.removeItem('token_refreshing')
          }
          return false
        }

        // Get Keycloak configuration from server
        const keycloakConfig = await $fetch('/api/keycloak/config')
        
        const formData = new URLSearchParams()
        formData.append('client_id', keycloakConfig.keycloakClientId)
        formData.append('grant_type', 'refresh_token')
        formData.append('refresh_token', refreshToken)

        const response = await axios.post(
          `${keycloakConfig.keycloakBaseUrl}/realms/${keycloakConfig.keycloakRealm}/protocol/openid-connect/token`,
          formData,
          {
            headers: {
              'Content-Type': 'application/x-www-form-urlencoded'
            }
          }
        )

        const { access_token, refresh_token, expires_in } = response.data

        // Calculate expiration times
        const now = Date.now()
        const tokenExpiry = now + (expires_in * 1000)
        const refreshExpiry = now + (response.data.refresh_expires_in * 1000)

        // Store tokens
        this.storeTokens(
          access_token,
          refresh_token,
          tokenExpiry,
          refreshExpiry
        )

        // Update user data
        const decodedToken = jwtDecode(access_token)
        this.user = decodedToken
        this.isAuthenticated = true

        console.log('Manual token refresh successful')
        
        // Notify UI that token was refreshed
        if (process.client) {
          const timestamp = Date.now();
          sessionStorage.removeItem('token_refreshing')
          sessionStorage.setItem('token_refreshed', 'true')
          sessionStorage.setItem('token_refreshed_at', timestamp.toString())
          
          // Update activity timestamp to prevent premature logout
          this.updateUserActivity()
          
          // Dispatch event to notify components
          if (window.dispatchEvent) {
            console.log('Dispatching manual token refresh event')
            
            // First dispatch tokenChange for global token manager
            window.dispatchEvent(new CustomEvent('tokenChange', { 
              detail: { tokenType: 'keycloak', value: access_token, timestamp: timestamp } 
            }))
            
            // Then dispatch direct event for components listening specifically
            window.dispatchEvent(new CustomEvent('auth:token:refreshed', {
              detail: { timestamp: timestamp, message: 'Token refreshed successfully' }
            }))
            
            console.log('Token refresh events dispatched at', new Date(timestamp).toLocaleString())
          }
        }
        
        this.isRefreshing = false
        return true
      } catch (error) {
        console.error('Manual token refresh failed:', error)

        // Only clear auth state if refresh token is invalid
        // Don't clear tokens on network errors or other temporary issues
        if (error.response && (error.response.status === 400 || error.response.status === 401)) {
          console.log('Refresh token invalid or expired, clearing auth state')
          // Don't clear tokens during refresh
          this.isRefreshing = false
          this.isAuthenticated = false
          this.user = null
        }

        this.isRefreshing = false
        if (process.client) {
          sessionStorage.removeItem('token_refreshing')
        }
        return false
      }
    },

    // Login
    async login() {
      if (!this.keycloak) return;
      
      try {
        // Get Keycloak configuration from server
        const keycloakConfig = await $fetch('/api/keycloak/config')
        
        if (!keycloakConfig.keycloakRedirectUri) {
          throw new Error('Keycloak redirect URI not configured')
        }
        
        const state =
          Math.random().toString(36).substring(2, 15) +
          Math.random().toString(36).substring(2, 15) +
          Math.random().toString(36).substring(2, 15);

        localStorage.setItem("auth.keycloak.pkce_state", state);
        this.pkce_state = state;
        this.keycloak.login({
          redirectUri: keycloakConfig.keycloakRedirectUri + "/auth/validasi_login",
          scope: "openid profile email",
          prompt: "login",
          // Force redirect-based login to avoid iframe issues
          adapter: 'default'
        });
      } catch (error) {
        console.error('Failed to get Keycloak config for login:', error)
        this.error = error.message
      }
    },

    async loginWithCredentials(values) {
      try {
        // Get Keycloak configuration from server
        const keycloakConfig = await $fetch('/api/keycloak/config')
        
        const formData = new URLSearchParams()

        // Add credentials to form data
        for (const key in values) {
          formData.append(key, values[key])
        }

        // Call Keycloak token endpoint directly
        const response = await axios.post(
          `${keycloakConfig.keycloakBaseUrl}/realms/${keycloakConfig.keycloakRealm}/protocol/openid-connect/token`,
          formData,
          {
            headers: {
              'Content-Type': 'application/x-www-form-urlencoded',
            }
          }
        )

        // Extract tokens from response
        const { access_token, refresh_token, expires_in, id_token } = response.data

        // Decode the ID token
        const decodedIdToken = jwtDecode(id_token)
        this.user = decodedIdToken

        // Store email for API calls
        if (this.user && this.user.email) {
          localStorage.setItem('userEmail', this.user.email)
        }

        // Calculate expiration times
        const now = Date.now()
        const tokenExpiry = now + (expires_in * 1000)
        const refreshExpiry = now + (response.data.refresh_expires_in * 1000)

        // Store tokens
        this.storeTokens(
          access_token,
          refresh_token,
          tokenExpiry,
          refreshExpiry
        )

        this.isAuthenticated = true

        // Don't call getUsers() here to avoid skipping OTP validation
        // The OTP validation page will handle the role checking after OTP verification

        return true
      } catch (error) {
        console.error('Failed to login with credentials:', error)
        this.error = error.message
        return false
      }
    },

    async logout() {
      // Set flag to allow clearing tokens
      this.isRefreshing = false

      this.clearTokens()

      try {
        // Get Keycloak configuration from server
        const keycloakConfig = await $fetch('/api/keycloak/config')
        
        const baseLogoutUrl = `${keycloakConfig.keycloakBaseUrl}/realms/${keycloakConfig.keycloakRealm}/protocol/openid-connect/logout`
        const clientId = keycloakConfig.keycloakClientId
        const logoutUri = encodeURIComponent(keycloakConfig.keycloakRedirectUri)

        window.location.href = `${baseLogoutUrl}?client_id=${clientId}&logout_uri=${logoutUri}`
      } catch (error) {
        console.error('Failed to get Keycloak config for logout:', error)
        // Fallback: just redirect to home
        window.location.href = '/'
      }
    },

    hasRole(role) {
      if (!this.user || !this.user.realm_access) return false
      return this.user.realm_access.roles?.includes(role) || false
    },

    hasAnyRole(roles) {
      if (!Array.isArray(roles) || roles.length === 0) return false
      return roles.some(role => this.hasRole(role))
    },

    async getUsers(skipRedirect = false) {
      try {
        const { token } = useAuthToken();
        const userEmail = localStorage.getItem('userEmail')
        const config = useRuntimeConfig()
        const apiBaseUrl = config.public.apiBaseUrl
        if (!userEmail) {
          console.warn("User email not available, skipping getUsers call")
          return null
        }

        const response = await axios.get(`${apiBaseUrl}/api/user/getusers/${userEmail}`, {
          headers: {
            Authorization: token.value
          }
        })

        this.getUsersData = response.data.data
        this.tokenUserData = response.data.data.token
        this.appIdUserData = response.data.data.id

        if (!this.appIdUserData) {
          throw new Error("App ID is not available in the response")
        }

        localStorage.setItem('userToken', this.tokenUserData)
        localStorage.setItem('appId', this.appIdUserData)

        return this.getUsersData
      } catch (error) {
        console.error("Failed to fetch users:", error)

        // If it's a 404, it might mean the endpoint doesn't exist or user doesn't exist
        if (error.response?.status === 404) {
          console.warn("User endpoint returned 404 - user might not exist in system yet")

          // Don't throw error for 404 during skipRedirect mode (initialization)
          if (skipRedirect) {
            return null
          }
        }

        // Only throw error if not skipping redirect
        if (!skipRedirect) {
          throw new Error("Unable to load dashboard. Please check your app ID.")
        }

        return null
      }
    },

    setAccessTokenCookie() {
      if (process.client) {
        try {
          const accessTokenCookie = useCookie('access_token')
          this.accessTokenCookieValue = accessTokenCookie.value
        } catch (error) {
          console.error('Failed to set access token cookie:', error)
        }
      }
    },

    // Check if session is valid and restore if needed
    async checkAndRestoreSession() {
      if (process.server) return false

      try {
        // First check if we're already authenticated
        if (this.isAuthenticated && this.user) {
          return true
        }

        // Try to restore from localStorage
        const restored = await this.restoreSession()
        if (restored) {
          return true
        }

        // If not restored, try to initialize Keycloak
        if (!this.keycloak) {
          return await this.initKeycloak()
        }

        return false
      } catch (error) {
        console.error('Failed to check and restore session:', error)
        return false
      }
    },

    // Track user activity to manage token refresh
    updateUserActivity() {
      if (process.client) {
        this.lastUserActivity = Date.now()
        this.isActive = true
        
        // Store the activity timestamp in session storage for persistence across tabs
        sessionStorage.setItem('lastUserActivity', this.lastUserActivity.toString())
      }
    },
    
    // Check if user has been inactive beyond the timeout period
    checkUserInactivity() {
      if (process.client) {
        // Try to get the latest activity timestamp from session storage (for multi-tab support)
        const storedActivity = sessionStorage.getItem('lastUserActivity')
        const lastActivity = storedActivity ? parseInt(storedActivity) : this.lastUserActivity
        
        const now = Date.now()
        const inactiveTime = now - lastActivity
        
        // If inactive beyond threshold, mark as inactive and log out
        if (inactiveTime >= INACTIVITY_TIMEOUT) {
          console.log(`User inactive for ${Math.floor(inactiveTime / 60000)} minutes, logging out`)
          this.isActive = false
          
          // Clear tokens and log out
          this.logout()
          return true
        }
        
        return false
      }
      
      return false
    },

    // Alternative initialization method that avoids iframe completely
    async initKeycloakRedirectOnly() {
      // Don't initialize on server side
      if (process.server) return false

      // Avoid multiple initializations
      if (this.isInitialized && this.keycloak) return true

      this.loading = true

      try {
        // Get Keycloak configuration from server
        const keycloakConfig = await $fetch('/api/keycloak/config')
        
        // Check localStorage first for existing tokens
        const token = localStorage.getItem('auth._token.keycloak')
        const refreshToken = localStorage.getItem('auth._refresh_token.keycloak')
        const tokenExpiry = parseInt(localStorage.getItem('auth._token_expiration.keycloak') || '0')

        // If we have valid tokens, use them
        if (token && refreshToken && tokenExpiry > Date.now()) {
          try {
            // Parse token to get user info
            const tokenValue = token.replace('Bearer ', '')
            const decodedToken = JSON.parse(atob(tokenValue.split('.')[1]))
            this.user = decodedToken
            this.isAuthenticated = true

            // Get user data if needed
            if (decodedToken.email) {
              localStorage.setItem('userEmail', decodedToken.email)
              await this.getUsers(true)
            }

            this.isInitialized = true
            return true
          } catch (error) {
            console.error('Failed to restore session from localStorage:', error)
            // Continue with normal initialization
          }
        }

        // Create Keycloak instance with redirect-only configuration
        this.keycloak = new Keycloak({
          url: keycloakConfig.keycloakBaseUrl,
          realm: keycloakConfig.keycloakRealm,
          clientId: keycloakConfig.keycloakClientId
        })

        // Initialize Keycloak with redirect-only mode (no iframe)
        const authenticated = await this.keycloak.init({
          onLoad: 'check-sso',
          pkceMethod: 'S256',
          checkLoginIframe: false, // Completely disable iframe
          // Remove silentCheckSsoRedirectUri to avoid iframe creation
          enableLogging: true,
          flow: 'standard',
          responseMode: 'query' // Use query parameters instead of fragments
        })

        if (authenticated) {
          // Store tokens
          this.storeTokens(
            this.keycloak.token,
            this.keycloak.refreshToken,
            this.keycloak.tokenParsed.exp * 1000,
            this.keycloak.refreshTokenParsed.exp * 1000
          )

          // Parse user from token
          this.user = this.keycloak.tokenParsed
          this.isAuthenticated = true

          // Store email for API calls
          if (this.user && this.user.email) {
            localStorage.setItem('userEmail', this.user.email)
            await this.getUsers(true)
          }

          // Set up token refresh
          this.setupTokenRefresh()
        }

        // Set up event listeners (but no iframe-related ones)
        this.setupKeycloakEventListeners()

        this.isInitialized = true
        return authenticated
      } catch (error) {
        console.error('Failed to initialize Keycloak (redirect-only):', error)
        this.error = error.message
        return false
      } finally {
        this.loading = false
        this.setAccessTokenCookie()
      }
    }
  }
})

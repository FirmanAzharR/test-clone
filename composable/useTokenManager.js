// cookie centralizes token management for authentication and user data.
export const useTokenManager = () => {
  // Global token change event emitter
  const emitTokenChange = (tokenType, value) => {
    if (typeof window !== 'undefined' && window.dispatchEvent) {
      window.dispatchEvent(new CustomEvent('tokenChange', { 
        detail: { tokenType, value, timestamp: Date.now() } 
      }))
    }
  }
  
  // Cookie names constants
  const COOKIE_NAMES = {
    ACCESS_TOKEN: 'access_token',
    USER_TOKEN: 'userToken', 
    USER_EMAIL: 'userEmail',
    APP_ID: 'appId',
    // Keycloak tokens
    KEYCLOAK_TOKEN: 'auth._token.keycloak',
    KEYCLOAK_REFRESH_TOKEN: 'auth._refresh_token.keycloak',
    KEYCLOAK_TOKEN_EXPIRY: 'auth._token_expiration.keycloak',
    KEYCLOAK_REFRESH_TOKEN_EXPIRY: 'auth._refresh_token_expiration.keycloak',
    KEYCLOAK_STRATEGY: 'auth.strategy',
    KEYCLOAK_PKCE_STATE: 'auth.keycloak.pkce_state',
    // Local flags
    LOCAL_TOKEN: 'auth._token.local',
    LOCAL_TOKEN_EXPIRY: 'auth._token_expiration.local'
  }

  // Default cookie options
  const defaultCookieOptions = {
    httpOnly: false, // Allow client-side access for compatibility
    sameSite: 'none',
    maxAge: 60 * 60 * 24 * 7 // 7 days default
  }  // Set token in cookie
  const setToken = (name, value, options = {}) => {
    if (process.server) return
    
    try {
      const finalOptions = { ...defaultCookieOptions, ...options }
      const cookie = useCookie(name, finalOptions)
      cookie.value = value
      
      // Also set using document.cookie as fallback
      if (typeof document !== 'undefined') {
        const expires = new Date(Date.now() + (finalOptions.maxAge * 1000)).toUTCString()
        document.cookie = `${name}=${encodeURIComponent(value)}; expires=${expires}; path=/; SameSite=${finalOptions.sameSite}`
      }
        // Trigger reactivity for token changes
      if (typeof refreshCookie === 'function') {
        refreshCookie(name)
      }
      
      // Emit token change event for global reactivity
      emitTokenChange(name, value)
    } catch (error) {
      console.error('Error setting token:', error)
    }
  }

  // Get token from cookie
  const getToken = (name) => {
    if (process.server) return null
    
    try {
      const cookie = useCookie(name)
      let value = cookie.value || null
      
      // Fallback to document.cookie if useCookie returns null
      if (!value && typeof document !== 'undefined') {
        const cookieMatch = document.cookie.match(new RegExp('(^| )' + name + '=([^;]+)'))
        if (cookieMatch) {
          value = decodeURIComponent(cookieMatch[2])
        }
      }
      
      return value
    } catch (error) {
      console.error('Error getting token:', error)
      return null
    }
  }

  // Remove token from cookie
  const removeToken = (name) => {
    if (process.server) return
    const cookie = useCookie(name)
    cookie.value = null
  }

  // Set access token (for login store)
  const setAccessToken = (token, expiresInDays = 7) => {
    setToken(COOKIE_NAMES.ACCESS_TOKEN, token, {
      maxAge: 60 * 60 * 24 * expiresInDays
    })
  }

  // Get access token
  const getAccessToken = () => {
    return getToken(COOKIE_NAMES.ACCESS_TOKEN)
  }
  // Set user token (for admin operations)
  const setUserToken = (token) => {
    console.log('Setting user token for admin operations')
    setToken(COOKIE_NAMES.USER_TOKEN, token)
  }
  // Get user token
  const getUserToken = () => {
    const token = getToken(COOKIE_NAMES.USER_TOKEN)
    console.log("Getting user token:", token ? "found" : "not found")
    return token
  }

  // Set user email
  const setUserEmail = (email) => {
    setToken(COOKIE_NAMES.USER_EMAIL, email)
  }

  // Get user email
  const getUserEmail = () => {
    return getToken(COOKIE_NAMES.USER_EMAIL)
  }
  // Set app ID
  const setAppId = (appId) => {
    setToken(COOKIE_NAMES.APP_ID, appId)
  }

  // Get app ID
  const getAppId = () => {
    const appId = getToken(COOKIE_NAMES.APP_ID)
    return appId
  }// Keycloak token management
  const setKeycloakTokens = (token, refreshToken, tokenExpiry, refreshTokenExpiry) => {
    setToken(COOKIE_NAMES.KEYCLOAK_TOKEN, `Bearer ${token}`)
    setToken(COOKIE_NAMES.KEYCLOAK_REFRESH_TOKEN, refreshToken)
    setToken(COOKIE_NAMES.KEYCLOAK_TOKEN_EXPIRY, tokenExpiry.toString())
    setToken(COOKIE_NAMES.KEYCLOAK_REFRESH_TOKEN_EXPIRY, refreshTokenExpiry.toString())
    setToken(COOKIE_NAMES.KEYCLOAK_STRATEGY, 'keycloak')
    // Set local flags to false
    setToken(COOKIE_NAMES.LOCAL_TOKEN, 'false')
    setToken(COOKIE_NAMES.LOCAL_TOKEN_EXPIRY, 'false')
  }
  const getKeycloakToken = () => {
    const token = getToken(COOKIE_NAMES.KEYCLOAK_TOKEN)
    return token
  }

  const getKeycloakRefreshToken = () => {
    return getToken(COOKIE_NAMES.KEYCLOAK_REFRESH_TOKEN)
  }

  const getKeycloakTokenExpiry = () => {
    const expiry = getToken(COOKIE_NAMES.KEYCLOAK_TOKEN_EXPIRY)
    return expiry ? parseInt(expiry) : 0
  }

  const getKeycloakRefreshTokenExpiry = () => {
    const expiry = getToken(COOKIE_NAMES.KEYCLOAK_REFRESH_TOKEN_EXPIRY)
    return expiry ? parseInt(expiry) : 0
  }

  const isKeycloakTokenExpired = () => {
    const expiry = getKeycloakTokenExpiry()
    return Date.now() >= expiry
  }

  // Set PKCE state
  const setPkceState = (state) => {
    setToken(COOKIE_NAMES.KEYCLOAK_PKCE_STATE, state)
  }

  // Get PKCE state
  const getPkceState = () => {
    return getToken(COOKIE_NAMES.KEYCLOAK_PKCE_STATE)
  }

  // Remove PKCE state
  const removePkceState = () => {
    removeToken(COOKIE_NAMES.KEYCLOAK_PKCE_STATE)
  }

  // Clear all tokens
  const clearAllTokens = () => {
    Object.values(COOKIE_NAMES).forEach(cookieName => {
      removeToken(cookieName)
    })
  }

  // Clear keycloak tokens
  const clearKeycloakTokens = () => {
    removeToken(COOKIE_NAMES.KEYCLOAK_TOKEN)
    removeToken(COOKIE_NAMES.KEYCLOAK_REFRESH_TOKEN)
    removeToken(COOKIE_NAMES.KEYCLOAK_TOKEN_EXPIRY)
    removeToken(COOKIE_NAMES.KEYCLOAK_REFRESH_TOKEN_EXPIRY)
    removeToken(COOKIE_NAMES.KEYCLOAK_STRATEGY)
    removeToken(COOKIE_NAMES.KEYCLOAK_PKCE_STATE)
    removeToken(COOKIE_NAMES.LOCAL_TOKEN)
    removeToken(COOKIE_NAMES.LOCAL_TOKEN_EXPIRY)
  }

  // Clear login tokens
  const clearLoginTokens = () => {
    removeToken(COOKIE_NAMES.ACCESS_TOKEN)
    removeToken(COOKIE_NAMES.USER_TOKEN)
    removeToken(COOKIE_NAMES.USER_EMAIL)
    removeToken(COOKIE_NAMES.APP_ID)
  }

  // Listen to token changes globally
  const onTokenChange = (callback) => {
    if (typeof window !== 'undefined') {
      const handler = (event) => callback(event.detail)
      window.addEventListener('tokenChange', handler)
      return () => window.removeEventListener('tokenChange', handler)
    }
    return () => {}
  }


  return {
    // Constants
    COOKIE_NAMES,
    
    // Generic methods
    setToken,
    getToken,
    removeToken,
    
    // Specific token methods
    setAccessToken,
    getAccessToken,
    setUserToken,
    getUserToken,
    setUserEmail,
    getUserEmail,
    setAppId,
    getAppId,
    
    // Keycloak methods
    setKeycloakTokens,
    getKeycloakToken,
    getKeycloakRefreshToken,
    getKeycloakTokenExpiry,
    getKeycloakRefreshTokenExpiry,
    isKeycloakTokenExpired,
    setPkceState,
    getPkceState,
    removePkceState,
    
    // Clear methods
    clearAllTokens,
    clearKeycloakTokens,
    clearLoginTokens,
    
    // Event methods
    onTokenChange
  }
}

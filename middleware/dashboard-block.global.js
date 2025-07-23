// Global middleware untuk memblokir akses dashboard secara mutlak
import { useAuthKeycloakStore } from '~/store/auth/auth'

export default defineNuxtRouteMiddleware((to, from) => {
  // Block dashboard access di server dan client
  if (to.path.startsWith('/dashboard')) {
    // Di server side, langsung redirect tanpa render
    if (process.server) {
      return navigateTo('/login', { redirectCode: 302 })
    }
    
    // Di client side, check authentication dengan tolerance untuk token refresh
    const token = localStorage.getItem('auth._token.keycloak')
    const tokenExpiry = parseInt(localStorage.getItem('auth._token_expiration.keycloak') || '0')
    const hasCompletedOTP = localStorage.getItem('TokenInAuth') && localStorage.getItem('userId')
    
    // Add 60 second buffer for token refresh process (increased from 30 seconds)
    const hasValidKeycloakToken = token && (tokenExpiry - 60000) > Date.now()
    
    // Check if token was recently refreshed
    const tokenRefreshedAt = parseInt(sessionStorage.getItem('token_refreshed_at') || '0')
    const wasRecentlyRefreshed = (Date.now() - tokenRefreshedAt) < 60000 // Within last 60 seconds (increased from 30 seconds)
    
    if (!hasValidKeycloakToken || !hasCompletedOTP) {
      // Allow access if tokens were recently refreshed or if refresh is in progress
      const isRefreshing = sessionStorage.getItem('token_refreshing') === 'true'
      
      // Log information for debugging
      console.log('Dashboard access check:', {
        hasValidToken: hasValidKeycloakToken,
        hasCompletedOTP,
        wasRecentlyRefreshed,
        isRefreshing,
        tokenRefreshedAt: new Date(tokenRefreshedAt).toLocaleString()
      })
      
      // Force token refresh if not valid and not already refreshing
      if (!hasValidKeycloakToken && !isRefreshing && !wasRecentlyRefreshed) {
        // Try to trigger a manual token refresh
        const authStore = useAuthKeycloakStore()
        try {
          console.log('Attempting emergency token refresh in middleware')
          authStore.manualTokenRefresh()
          // Allow navigation to continue - the refresh will either succeed or fail and redirect later
          return
        } catch (error) {
          console.error('Emergency token refresh failed:', error)
          return abortNavigation('Unauthorized access to dashboard - token refresh failed')
        }
      }
      
      // Only block if not refreshing and not recently refreshed
      if (!isRefreshing && !wasRecentlyRefreshed) {
        return abortNavigation('Unauthorized access to dashboard')
      }
    }
  }
})

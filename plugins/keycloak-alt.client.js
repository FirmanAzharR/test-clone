import { useAuthKeycloakStore } from '~/store/auth/auth'

export default defineNuxtPlugin(async (nuxtApp) => {
  if (process.server) return
  
  // Alternative approach: Skip iframe completely for CSP-strict environments
  nuxtApp.hook('app:created', async () => {
    const authStore = useAuthKeycloakStore()
    
    // Check if we're in a CSP-strict environment
    const isCSPStrict = window.location.hostname.includes('jogjaprov.go.id')
    
    // Try to initialize Keycloak with error handling
    try {
      if (isCSPStrict) {
        // For production domains, use redirect-only authentication
        console.log('CSP-strict environment detected, using redirect-only auth')
        await authStore.initKeycloakRedirectOnly()
      } else {
        // For development, use standard initialization
        await authStore.initKeycloak()
      }
    } catch (error) {
      console.error('Failed to initialize Keycloak:', error)
      // Fallback to redirect-only if standard init fails
      try {
        await authStore.initKeycloakRedirectOnly()
      } catch (fallbackError) {
        console.error('Fallback auth also failed:', fallbackError)
      }
    }
    
    const originalFetch = window.fetch
    window.fetch = async (resource, options = {}) => {
      const url = resource.toString()
      
      if (authStore.loggedIn && (url.includes('/api/') || url.startsWith(window.location.origin + '/api/'))) {
        options.headers = options.headers || {}
        options.headers.Authorization = localStorage.getItem('auth._token.keycloak')
      }
      
      return originalFetch(resource, options)
    }
  })
})

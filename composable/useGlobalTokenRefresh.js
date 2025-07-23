// composables/useGlobalTokenRefresh.js
import { onMounted, onUnmounted, computed, nextTick, ref } from 'vue'
import { useAuthKeycloakStore } from '~/store/auth/auth'
import { useTokenManager } from '~/composable/useTokenManager'

export const useGlobalTokenRefresh = () => {
  const authStore = useAuthKeycloakStore()
  const { onTokenChange } = useTokenManager()
  
  let tokenChangeUnsubscribe = null
  const lastTokenRefresh = ref(Date.now())
  
  onMounted(() => {
    // Listen for token changes globally
    tokenChangeUnsubscribe = onTokenChange((detail) => {
      console.log('Token changed globally:', detail.tokenType)
      
      // If Keycloak tokens are updated, ensure all pages react to the change
      if (detail.tokenType.includes('keycloak') && authStore.isAuthenticated) {
        // Update last refresh timestamp to trigger reactivity
        lastTokenRefresh.value = detail.timestamp || Date.now()
        
        // Set a flag in sessionStorage to indicate token refresh completion
        if (typeof window !== 'undefined') {
          window.sessionStorage.setItem('token_refreshed', 'true')
          window.sessionStorage.setItem('token_refreshed_at', lastTokenRefresh.value.toString())
          
          // Clear the refreshing flag
          window.sessionStorage.setItem('token_refreshing', 'false')
          
          console.log('Global token refresh detected and processed at', new Date(lastTokenRefresh.value).toLocaleString())
        }
        
        // Force reactivity in current page context
        nextTick(() => {
          // Notify components that might depend on tokens with better logging
          console.log('Broadcasting auth:token:refreshed event to all components')
          window.dispatchEvent(new CustomEvent('auth:token:refreshed', {
            detail: { 
              timestamp: lastTokenRefresh.value,
              source: 'global-token-refresh'
            }
          }))
        })
      }
    })
    
    // Also listen for direct auth:token:refreshed events
    const handleDirectRefreshEvent = (event) => {
      const source = event.detail.source || 'unknown'
      const message = event.detail.message || 'Token refreshed'
      console.log(`Direct token refresh event detected from source: ${source} - ${message}`)
      lastTokenRefresh.value = event.detail.timestamp || Date.now()
      
      // Set session storage flags
      if (typeof window !== 'undefined') {
        window.sessionStorage.setItem('token_refreshed', 'true')
        window.sessionStorage.setItem('token_refreshed_at', lastTokenRefresh.value.toString())
        window.sessionStorage.setItem('token_refreshing', 'false')
        
        // Update the auth store's activity timestamp
        if (authStore) {
          authStore.updateUserActivity()
        }
        
        console.log('Token refresh event processed at', new Date(lastTokenRefresh.value).toLocaleString())
        
        // Force pages to update API clients with new token
        nextTick(() => {
          // Re-emit to ensure all components receive the event
          if (source !== 'global-token-refresh') {
            console.log('Re-broadcasting token refresh event to ensure all components update')
            window.dispatchEvent(new CustomEvent('tokenChange', { 
              detail: { tokenType: 'keycloak_refreshed', timestamp: lastTokenRefresh.value } 
            }))
          }
        })
      }
    }
    
    if (typeof window !== 'undefined') {
      window.addEventListener('auth:token:refreshed', handleDirectRefreshEvent)
    }
    
    // Ensure token refresh is running if user is authenticated
    if (authStore.isAuthenticated && authStore.keycloak && !authStore.refreshInterval) {
      authStore.setupTokenRefresh()
    }
    
    // Cleanup function to remove event listener
    onUnmounted(() => {
      if (tokenChangeUnsubscribe) {
        tokenChangeUnsubscribe()
      }
      if (typeof window !== 'undefined') {
        window.removeEventListener('auth:token:refreshed', handleDirectRefreshEvent)
      }
    })
  })
  
  return {
    isAuthenticated: computed(() => authStore.isAuthenticated),
    user: computed(() => authStore.user),
    loggedIn: computed(() => authStore.loggedIn),
    lastTokenRefresh: computed(() => lastTokenRefresh.value)
  }
}

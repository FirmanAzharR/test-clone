// composables/useAuth.js
import { useAuthKeycloakStore } from '~/store/auth/auth'
import { computed } from 'vue'

export function ComposableAuth() {
  const authStore = useAuthKeycloakStore()
  
  return {
    // State
    user: computed(() => authStore.user),
    loggedIn: computed(() => authStore.loggedIn),
    loading: computed(() => authStore.loading),
    error: computed(() => authStore.error),
    
    // Tokens
    token: computed(() => authStore.token),
    refreshToken: computed(() => authStore.refreshToken),
    tokenExpiry: computed(() => authStore.tokenExpiry),
    refreshTokenExpiry: computed(() => authStore.refreshTokenExpiry),
    isTokenExpired: computed(() => authStore.isTokenExpired),
    
    // Actions
    login: () => authStore.login(),
    logout: () => authStore.logout(),
    refreshTokens: () => authStore.refreshTokens(),
    
    // Role checks
    hasRole: (role) => authStore.hasRole(role),
    hasAnyRole: (roles) => authStore.hasAnyRole(roles),
    roles: computed(() => authStore.roles)
  }
}
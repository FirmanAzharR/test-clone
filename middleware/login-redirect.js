import { defineNuxtRouteMiddleware, navigateTo } from '#app'
import { useAuthKeycloakStore } from '~/store/auth/auth'

export default defineNuxtRouteMiddleware((to, from) => {
  // Skip on server-side to avoid hydration issues
  if (process.server) return
  const authStore = useAuthKeycloakStore()
  if (authStore.loading) {
    return
  }
  
  // Only redirect if user is on login page and has both Keycloak auth AND OTP completion
  if (to.path === '/login' && authStore.loggedIn) {
    const hasCompletedOTP = localStorage.getItem('TokenInAuth') && localStorage.getItem('userId')
    
    if (hasCompletedOTP) {
      console.log('User fully authenticated (Keycloak + OTP), redirecting to dashboard')
      return navigateTo('/dashboard')
    } else {
      console.log('User has Keycloak auth but no OTP, redirecting to validation')
      return navigateTo('/auth/validasi_login')
    }
  }
})
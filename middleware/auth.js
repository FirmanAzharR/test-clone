import { useAuthKeycloakStore } from '~/store/auth/auth'

export default defineNuxtRouteMiddleware(async (to, from) => {
  // Hindari eksekusi middleware di server side
  if (process.server) return
  
  const authStore = useAuthKeycloakStore()
  
  // Cek token di localStorage terlebih dahulu
  const token = localStorage.getItem('auth._token.keycloak')
  const tokenExpiry = parseInt(localStorage.getItem('auth._token_expiration.keycloak') || '0')
  const hasValidToken = token && tokenExpiry > Date.now()
  const hasCompletedOTP = localStorage.getItem('TokenInAuth') && localStorage.getItem('userId')
  
  // CRITICAL: Block dashboard access immediately if not authenticated
  if (to.path.startsWith('/dashboard')) {
    if (!hasValidToken || !hasCompletedOTP) {
      // Check if token refresh is in progress before redirecting
      const isRefreshing = sessionStorage.getItem('token_refreshing') === 'true'
      if (!isRefreshing) {
        return navigateTo('/login')
      }
    }
  }
  
  // Jika sudah ada token valid, set isAuthenticated
  if (hasValidToken && !authStore.isAuthenticated) {
    try {
      // Parse token untuk mendapatkan user info
      const tokenValue = token.replace('Bearer ', '')
      const decodedToken = JSON.parse(atob(tokenValue.split('.')[1]))
      authStore.user = decodedToken
      authStore.isAuthenticated = true
      
      // Ambil user data hanya jika belum ada TokenInAuth (belum complete OTP)
      if (decodedToken.email) {
        localStorage.setItem('userEmail', decodedToken.email)
      }
    } catch (error) {
      console.error("Error parsing token:", error)
      authStore.clearTokens()
    }
  }

  // Inisialisasi Keycloak jika perlu
  if (!authStore.keycloak && typeof authStore.initKeycloak === 'function' && !hasValidToken) {
    try {
      await authStore.initKeycloak()
    } catch (error) {
      console.error("Keycloak init error:", error)
      authStore.clearTokens()
      
      // Only redirect to login if not already going there
      if (to.path !== '/login') {
        try {
          return navigateTo('/login')
        } catch (navError) {
          if (process.client) {
            window.location.href = '/login'
          }
        }
      }
    }
  }

  // Cek status login setelah inisialisasi
  const hasKeycloakAuth = authStore.isAuthenticated && authStore.user !== null
  
  // User harus memiliki kedua: Keycloak auth AND completed OTP
  const isFullyAuthenticated = hasKeycloakAuth && hasCompletedOTP
  
  // Define auth pages that don't require OTP completion
  const authPages = ['/auth/validasi_login', '/auth/validasi_otp', '/login']
  const isAuthPage = authPages.includes(to.path)
  
  // 🔒 SECURITY: Handle unauthorized navigation from OTP page
  // If user tries to navigate away from OTP page without completing it, clear tokens
  if (from.path === '/auth/validasi_otp' && !hasCompletedOTP && !authPages.includes(to.path)) {
    console.log('🚨 Security: User trying to bypass OTP flow, clearing tokens')
    authStore.clearTokens()
    
    // Force redirect to login
    try {
      return navigateTo('/login')
    } catch (error) {
      if (process.client) {
        window.location.href = '/login'
      }
    }
  }
  
  if (!hasKeycloakAuth && !isAuthPage) {
    // Tidak ada Keycloak auth dan bukan halaman auth, redirect ke login
    try {
      return navigateTo('/login')
    } catch (error) {
      // Fallback using window.location if navigateTo fails
      if (process.client) {
        window.location.href = '/login'
      }
    }
  } else if (hasKeycloakAuth && !hasCompletedOTP && !isAuthPage) {
    // Ada Keycloak auth tapi belum complete OTP, dan bukan halaman auth
    // Redirect ke validasi login dulu
    try {
      return navigateTo('/auth/validasi_login')
    } catch (error) {
      // Fallback using window.location if navigateTo fails
      if (process.client) {
        window.location.href = '/auth/validasi_login'
      }
    }
  } else if (!isFullyAuthenticated && !isAuthPage && to.path !== '/login') {
    // Fallback jika ada kondisi lain yang tidak valid dan bukan halaman auth
    try {
      return navigateTo('/login')
    } catch (error) {
      // Fallback using window.location if navigateTo fails
      if (process.client) {
        window.location.href = '/login'
      }
    }
  }
})

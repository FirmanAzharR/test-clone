// Middleware untuk mencegah bypass OTP via direct URL access
// Melindungi dashboard dan halaman protected lainnya

export default function otpProtection(to, from) {
  // Only run on client side
  if (process.server) return

  const hasKeycloakAuth = localStorage.getItem("auth._token.keycloak")
  const hasCompletedOTP = localStorage.getItem("TokenInAuth") && localStorage.getItem("userId")
  
  // If user has Keycloak auth but no OTP completion
  if (hasKeycloakAuth && !hasCompletedOTP) {
    console.log('🚨 OTP Protection: User trying to access protected area without OTP')
    
    // Clear tokens for security
    localStorage.removeItem('auth._token.keycloak')
    localStorage.removeItem('auth._token_expiration.keycloak')
    localStorage.removeItem('TokenInAuth')
    localStorage.removeItem('userId')
    localStorage.removeItem('userRole')
    localStorage.removeItem('userEmail')
    
    return navigateTo('/login')
  }
  
  // If no Keycloak auth at all
  if (!hasKeycloakAuth) {
    return navigateTo('/login')
  }
}

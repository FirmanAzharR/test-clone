// Middleware untuk memastikan user sudah login dengan Keycloak
// Digunakan untuk melindungi halaman OTP agar tidak bisa diakses langsung

export default function keycloakRequired(to, from) {
  // Only run on client side
  if (process.server) return

  const keycloakToken = localStorage.getItem("auth._token.keycloak")
  
  if (!keycloakToken || keycloakToken.trim() === "") {
    return navigateTo('/login')
  }

  // Check if token is expired
  const tokenExpiry = parseInt(localStorage.getItem('auth._token_expiration.keycloak') || '0')
  if (tokenExpiry <= Date.now()) {
    return navigateTo('/login')
  }
}

// Basic app-wide headers to help with frame issues
export default defineEventHandler((event) => {
  setResponseHeaders(event, {
    // Remove X-Frame-Options to let CSP handle it
    // 'X-Frame-Options': 'ALLOWALL',
    
    // More permissive CSP for Keycloak integration and common embeds
    'Content-Security-Policy': "frame-ancestors 'self' https://*.jogjaprov.go.id https://sso.jogjaprov.go.id; frame-src 'self' https://*.jogjaprov.go.id https://sso.jogjaprov.go.id https://www.youtube.com https://youtube.com https://*.youtube.com https://www.google.com https://*.google.com https://www.google.com/maps https://*.whatsapp.com",
    
    // Other security headers
    'X-Content-Type-Options': 'nosniff',
    'X-XSS-Protection': '1; mode=block'
  })
})

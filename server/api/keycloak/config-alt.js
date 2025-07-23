// Alternative approach: Use redirect-based authentication instead of iframe
export default defineEventHandler(async (event) => {
  // Get runtime config
  const config = useRuntimeConfig(event)
  
  // Return config with explicit settings to avoid iframe issues
  return {
    keycloakBaseUrl: config.keycloakBaseUrl,
    keycloakClientId: config.keycloakClientId,
    keycloakRedirectUri: config.keycloakRedirectUri,
    keycloakRealm: config.keycloakRealm,
    // Add flag to force redirect-based flow
    forceRedirectAuth: true
  }
})

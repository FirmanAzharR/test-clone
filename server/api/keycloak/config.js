export default defineEventHandler(async (event) => {
  // Get runtime config
  const config = useRuntimeConfig(event)
  
  // Return minimal config needed for client
  return {
    keycloakBaseUrl: config.keycloakBaseUrl,
    keycloakClientId: config.keycloakClientId,
    keycloakRedirectUri: config.keycloakRedirectUri,
    keycloakRealm: config.keycloakRealm
  }
})

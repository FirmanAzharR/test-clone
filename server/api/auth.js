// Optimized permanent cache for static token - no TTL needed for static tokens
let cachedStaticToken = null
let cacheInitialized = false
let isInitializing = false

export default defineEventHandler(async (event) => {
  try {
    // Return cached token immediately if available
    if (cacheInitialized && cachedStaticToken) {
      return {
        token: cachedStaticToken,
        cached: true
      }
    }
    
    // Prevent multiple concurrent initializations
    if (isInitializing) {
      // Wait for initialization to complete
      while (isInitializing) {
        await new Promise(resolve => setTimeout(resolve, 10))
      }
      return {
        token: cachedStaticToken,
        cached: true
      }
    }
    
    // Initialize cache
    isInitializing = true
    
    try {
      const config = useRuntimeConfig(event)
      const staticToken = config.tokenInAuth
      
      if (!staticToken) {
        throw createError({
          statusCode: 500,
          statusMessage: 'Auth token not configured'
        })
      }
      
      // Permanently cache the static token
      cachedStaticToken = staticToken
      cacheInitialized = true
      
      console.log('[Auth] Static token permanently cached')
      
      return {
        token: staticToken,
        cached: false
      }
      
    } finally {
      isInitializing = false
    }
    
  } catch (error) {
    isInitializing = false
    console.error('[Auth] Error getting token:', error)
    throw createError({
      statusCode: 500,
      statusMessage: 'Failed to get auth token'
    })
  }
})

// Server-side plugin untuk pre-load static token saat server start
export default defineNuxtPlugin(async (nuxtApp) => {
  // Only run on server side
  if (process.server) {
    try {
      // Import token functions
      const { ensureServerToken } = await import('~/composable/useAuthToken')
      
      // Pre-load token saat server start
      await ensureServerToken()
      console.log('[Server Plugin] Static auth token pre-loaded successfully')
    } catch (error) {
      console.error('[Server Plugin] Failed to pre-load static token:', error)
    }
  }
})

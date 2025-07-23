import { ref } from 'vue'

// State global untuk client saja
const clientToken = ref(null)
const clientIsLoading = ref(false)
const clientError = ref(null)

// Optimized global server stats for better performance
const globalServerStats = global.serverTokenStats || (global.serverTokenStats = {
  token: null,
  tokenCached: false,
  tokenFetchCount: 0,
  cacheHitCount: 0,
  lastFetched: 0,
  isInitialized: false
})

// Optimized server token fetch with permanent caching
const fetchServerToken = async () => {
  // Return cached token immediately if available
  if (globalServerStats.isInitialized && globalServerStats.token) {
    globalServerStats.cacheHitCount++
    return globalServerStats.token
  }
  
  // Prevent redundant fetches during initialization
  if (globalServerStats.isInitialized) {
    return globalServerStats.token
  }
  
  // Fetch static token only once during server lifetime
  try {
    globalServerStats.tokenFetchCount++
    console.log('[useAuthToken] Fetching static server token (permanent cache)')
    
    const response = await $fetch('/api/auth')
    
    // Permanently cache the static token
    globalServerStats.token = response.token
    globalServerStats.tokenCached = true
    globalServerStats.isInitialized = true
    globalServerStats.lastFetched = Date.now()
    
    console.log('[useAuthToken] Static server token permanently cached')
    return globalServerStats.token
    
  } catch (err) {
    console.error('[useAuthToken] Server token fetch failed:', err)
    throw err
  }
}

const fetchToken = async (token, isLoading, error) => {
  if (token.value || isLoading.value) return token.value

  try {
    isLoading.value = true
    const response = await $fetch('/api/auth')
    token.value = response.token
    error.value = null
    return token.value
  } catch (err) {
    console.error('Failed to fetch auth token:', err)
    error.value = err
    throw err
  } finally {
    isLoading.value = false
  }
}

const ensureToken = async (token, isLoading, error) => {
  if (token.value) return token.value
  return await fetchToken(token, isLoading, error)
}

export function useAuthToken() {
  if (process.server) {
    return {
      get token() { 
        // Increment cache hit when token is accessed on server
        if (globalServerStats.isInitialized && globalServerStats.token) {
          globalServerStats.cacheHitCount++
        }
        return ref(globalServerStats.token) 
      },
      get isLoading() { return ref(false) }, // No loading state needed for static tokens
      get error() { return ref(null) }, // Simplified error handling
      fetchToken: fetchServerToken,
      ensureToken: fetchServerToken
    }
  }
  
  return {
    token: clientToken,
    isLoading: clientIsLoading,
    error: clientError,
    fetchToken: () => fetchToken(clientToken, clientIsLoading, clientError),
    ensureToken: () => ensureToken(clientToken, clientIsLoading, clientError)
  }
}

// Auto-initialize client
if (process.client && !clientToken.value && !clientIsLoading.value) {
  fetchToken(clientToken, clientIsLoading, clientError).catch(console.error)
}

// Utility functions
export const getServerToken = () => {
  if (process.server) {
    // Increment cache hit count when getting cached token
    if (globalServerStats.isInitialized && globalServerStats.token) {
      globalServerStats.cacheHitCount++
    }
    return globalServerStats.token
  }
  return null
}

export const ensureServerToken = async () => {
  if (process.server) {
    return await fetchServerToken()
  }
  return null
}

export const getTokenStats = () => {
  if (process.server) {
    const totalAccess = globalServerStats.tokenFetchCount + globalServerStats.cacheHitCount
    return {
      tokenFetches: globalServerStats.tokenFetchCount,
      cacheHits: globalServerStats.cacheHitCount,
      cacheHitRatio: totalAccess > 0 ? ((globalServerStats.cacheHitCount / totalAccess) * 100).toFixed(1) + '%' : '0%',
      tokenValid: globalServerStats.isInitialized && globalServerStats.token !== null,
      tokenCached: globalServerStats.tokenCached,
      isStaticToken: true,
      lastFetched: globalServerStats.lastFetched ? new Date(globalServerStats.lastFetched).toISOString() : null,
      cacheEfficiency: totalAccess > 0 ? 'HIGH' : 'NOT_USED'
    }
  }
  return null
}

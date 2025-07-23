import { getTokenStats } from '~/composable/useAuthToken'

export default defineEventHandler(async (event) => {
  try {
    const tokenStats = getTokenStats()
    
    // Server performance metrics
    const serverStats = {
      uptime: process.uptime(),
      memory: process.memoryUsage(),
      nodeVersion: process.version,
      timestamp: new Date().toISOString(),
      platform: process.platform,
      arch: process.arch
    }

    // Enhanced token performance analysis
    const tokenPerformance = {
      ...tokenStats,
      optimizationStatus: tokenStats?.tokenCached ? 'OPTIMIZED' : 'INITIALIZING',
      recommendation: getRecommendation(tokenStats),
      performanceGrade: getPerformanceGrade(tokenStats)
    }

    return {
      success: true,
      tokenPerformance,
      serverPerformance: serverStats,
      message: 'Performance monitoring data retrieved successfully'
    }
    
  } catch (error) {
    console.error('[Health Check] Error:', error)
    return {
      success: false,
      error: error.message,
      timestamp: new Date().toISOString()
    }
  }
})

// Helper function for performance recommendations
function getRecommendation(stats) {
  if (!stats) return 'Token system not initialized'
  
  if (stats.tokenCached && stats.cacheHits > 0) {
    const ratio = parseFloat(stats.cacheHitRatio)
    if (ratio >= 90) return 'Excellent: Token caching is highly optimized'
    if (ratio >= 75) return 'Good: Token caching is working properly'
    if (ratio >= 50) return 'Fair: Token caching is functional but could be improved'
    return 'Poor: Token caching needs optimization'
  }
  
  if (stats.tokenCached) return 'Token cached but not yet accessed by public endpoints'
  return 'Token caching not yet initialized'
}

// Helper function for performance grading
function getPerformanceGrade(stats) {
  if (!stats) return 'N/A'
  
  const ratio = parseFloat(stats.cacheHitRatio)
  if (ratio >= 90) return 'A+'
  if (ratio >= 80) return 'A'
  if (ratio >= 70) return 'B+'
  if (ratio >= 60) return 'B'
  if (ratio >= 50) return 'C'
  return 'D'
}

import { defineEventHandler, readBody } from 'h3'

export default defineEventHandler(async (event) => {
  const config = useRuntimeConfig()
  const body = await readBody(event)
  
  try {
    const { endpoint, payload, token } = body
    const propertyId = config.public.propertyId

    if (!token) {
      throw new Error('Analytics token is required')
    }

    // Construct the Google Analytics API URL
    const url = `https://analyticsdata.googleapis.com/v1beta/properties/${propertyId}:${endpoint}`

    // Forward the request to Google Analytics
    const response = await $fetch(url, {
      method: 'POST',
      body: payload,
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      }
    })

    return response
  } catch (error: any) {
    throw createError({
      statusCode: error.response?.status || 500,
      statusMessage: error.message
    })
  }
})

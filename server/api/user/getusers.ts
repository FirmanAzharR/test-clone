export default defineEventHandler(async (event) => {
    const config = useRuntimeConfig()
    const email = getQuery(event).email

    if (!email) {
        throw createError({ statusCode: 400, statusMessage: 'Email parameter is required' })
    }

    try {
        const response = await $fetch(`${config.apiBaseUrl}/user/getusers/${email}`, {
            headers: {
                Authorization: config.tokenInAuth
            }
        })

        return response
    } catch (error) {
        console.error('Failed to fetch user data from external API:', error)
        throw createError({ statusCode: 500, statusMessage: 'Failed to fetch user data' })
    }
})

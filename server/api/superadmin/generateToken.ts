export default defineEventHandler(async (event) => {
    const config = useRuntimeConfig()
    const { id } = getQuery(event)
    const token = getHeader(event, 'Authorization')

    if (!id) throw createError({ statusCode: 400, statusMessage: 'ID is required' })

    const headers: Record<string, string> = {
        Accept: 'application/json',
        'Content-Type': 'application/json'
    }
    if (token) {
        headers['Authorization'] = token
    }

    return await $fetch(`${config.apiBaseUrl}/user/gen-token/${id}`, {
        headers
    })
})

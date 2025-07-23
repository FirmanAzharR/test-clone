export default defineEventHandler(async (event) => {
    const config = useRuntimeConfig()
    const { page = 1, page_size = 1000000 } = getQuery(event)
    const token = getHeader(event, 'Authorization')

    const headers: Record<string, string> = {
        Accept: 'application/json',
        'Content-Type': 'application/json'
    }
    if (token) {
        headers['Authorization'] = token
    }

    return await $fetch(`${config.apiBaseUrl}/video/allvideos`, {
        params: { page, page_size },
        headers
    })
})

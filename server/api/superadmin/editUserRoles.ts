export default defineEventHandler(async (event) => {
    const config = useRuntimeConfig()
    const { id } = getQuery(event)
    const token = getHeader(event, 'Authorization')
    const body = await readBody(event)

    const headers: Record<string, string> = {
        Accept: 'application/json',
        'Content-Type': 'application/json'
    }
    if (token) {
        headers['Authorization'] = token
    }

    return await $fetch(`${config.apiBaseUrl}/user/userroles/${id}`, {
        method: 'PUT',
        body: body,
        headers
    })
})

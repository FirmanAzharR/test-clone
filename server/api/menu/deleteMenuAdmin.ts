export default defineEventHandler(async (event) => {
    const config = useRuntimeConfig()
    const token = getHeader(event, 'Authorization')
    const id = getQuery(event).id

    const headers: HeadersInit = token ? { Authorization: token } : {}

    return await $fetch(`${config.apiBaseUrl}/menu/menu/${id}`, {
        method: 'DELETE',
        headers
    })
})
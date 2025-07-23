export default defineEventHandler(async (event) => {
    const config = useRuntimeConfig()
    const { id } = getQuery(event)
    const token = getHeader(event, 'Authorization')

    return await $fetch(`${config.apiBaseUrl}/banner/banner/${id}`, {
        method: 'DELETE',
        headers: {
            ...(token ? { Authorization: token } : {}),
            Accept: 'application/json',
            'Content-Type': 'application/json'
        } as HeadersInit
    })
})

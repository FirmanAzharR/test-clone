export default defineEventHandler(async (event) => {
    const config = useRuntimeConfig()
    const token = getHeader(event, 'Authorization')

    return await $fetch(`${config.apiBaseUrl}/menu/allmenus`, {
        params: { page: 1, page_size: 5 },
        ...(token ? { headers: { Authorization: token } } : {})
    })
})
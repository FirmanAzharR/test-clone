export default defineEventHandler(async (event) => {
    const config = useRuntimeConfig()
    const { page = 1, page_size = 8 } = getQuery(event)

    return await $fetch(`${config.apiBaseUrl}/galeri/galeries`, {
        params: { page, page_size },
        headers: {
            Authorization: config.tokenInAuth,
            Accept: 'application/json',
            'Content-Type': 'application/json'
        }
    })
})

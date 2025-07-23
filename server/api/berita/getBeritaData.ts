export default defineEventHandler(async (event) => {
    const config = useRuntimeConfig()
    const { page = 1, page_size = 6 } = getQuery(event)

    return await $fetch(`${config.apiBaseUrl}/artikel/artikels/berita`, {
        params: { page, page_size },
        headers: {
            Authorization: config.tokenInAuth,
            Accept: 'application/json',
            'Content-Type': 'application/json'
        }
    })
})

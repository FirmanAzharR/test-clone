export default defineEventHandler(async (event) => {
    const config = useRuntimeConfig()
    const { category, page = 1, page_size = 100 } = getQuery(event)

    return await $fetch(`${config.apiBaseUrl}/artikel/artikels/${category}`, {
        params: { page, page_size },
        headers: {
            Authorization: config.tokenInAuth,
            Accept: 'application/json',
            'Content-Type': 'application/json'
        }
    })
})

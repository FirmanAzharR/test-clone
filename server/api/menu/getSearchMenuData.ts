export default defineEventHandler(async (event) => {
    const config = useRuntimeConfig()
    const q = getQuery(event).q

    return await $fetch(`${config.apiBaseUrl}/artikel/search?q=${q}`, {
        headers: {
            Authorization: config.tokenInAuth
        }
    })
})

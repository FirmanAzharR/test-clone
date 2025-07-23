export default defineEventHandler(async (event) => {
    const config = useRuntimeConfig()
    const id = getQuery(event).id

    return await $fetch(`${config.apiBaseUrl}/page/page/${id}`, {
        headers: { Authorization: config.tokenInAuth }
    })
})
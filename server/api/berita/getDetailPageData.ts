export default defineEventHandler(async (event) => {
    const config = useRuntimeConfig()
    const { id } = getQuery(event)

    return await $fetch(`${config.apiBaseUrl}/page/page/${id}`, {
        headers: {
            Authorization: config.tokenInAuth,
            Accept: 'application/json',
            'Content-Type': 'application/json'
        }
    })
})

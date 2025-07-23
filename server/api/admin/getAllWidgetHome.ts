export default defineEventHandler(async (event) => {
    const config = useRuntimeConfig()
    const { page } = getQuery(event)

    return await $fetch(`${config.apiBaseUrl}/widget/widgets`, {
        params: { page },
        headers: {
            Authorization: config.tokenInAuth,
            Accept: 'application/json',
            'Content-Type': 'application/json'
        }
    })
})

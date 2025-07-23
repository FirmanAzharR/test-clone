export default defineEventHandler(async (event) => {
    const config = useRuntimeConfig()

    return await $fetch(`${config.apiBaseUrl}/banner/banners`, {
        headers: {
            Authorization: config.tokenInAuth,
            Accept: 'application/json',
            'Content-Type': 'application/json'
        }
    })
})

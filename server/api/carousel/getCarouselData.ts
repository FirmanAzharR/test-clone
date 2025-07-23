export default defineEventHandler(async (event) => {
    const config = useRuntimeConfig()

    const response = await $fetch(`${config.apiBaseUrl}/slider/sliders`, {
        headers: {
            Authorization: config.tokenInAuth,
            Accept: 'application/json',
            'Content-Type': 'application/json'
        }
    })

    return response
})
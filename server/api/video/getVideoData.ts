export default defineEventHandler(async (event) => {
    const config = useRuntimeConfig()
    const { page = 1, page_size = 100 } = getQuery(event)

    return await $fetch(`https://ka2xhyaymy.jogjaprov.go.id/api/video/videos`, {
        params: { page, page_size },
        headers: {
            Authorization: config.tokenInAuth,
            Accept: 'application/json',
            'Content-Type': 'application/json'
        }
    })
})

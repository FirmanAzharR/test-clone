export default defineEventHandler(async (event) => {
    const config = useRuntimeConfig()
    const { id } = getQuery(event)

    if (!id) throw createError({ statusCode: 400, statusMessage: 'ID is required' })

    return await $fetch(`${config.apiBaseUrl}/banner/banner/${id}`, {
        headers: {
            Authorization: config.tokenInAuth,
            Accept: 'application/json',
            'Content-Type': 'application/json'
        }
    })
})

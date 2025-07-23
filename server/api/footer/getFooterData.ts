export default defineEventHandler(async (event) => {
    const config = useRuntimeConfig()
    const { page, page_size } = getQuery(event)

    return await $fetch(`${config.apiBaseUrl}/profil/profils`, {
        params: { page, page_size },
        headers: {
            Authorization: config.tokenInAuth
        }
    })
})

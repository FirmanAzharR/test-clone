export default defineEventHandler(async (event) => {
    const config = useRuntimeConfig()

    return await $fetch(`${config.apiBaseUrl}/menu/menus`, {
        headers: {
            Authorization: config.tokenInAuth
        }
    })
})

export default defineEventHandler(async (event) => {
    const config = useRuntimeConfig()
    const body = await readBody(event)

    try {
        const formData = new URLSearchParams()
        for (const key in body) {
            formData.append(key, body[key])
        }

        const response = await $fetch(`${config.LoginBaseUrl}/login-sso`, {
            method: 'POST',
            body: formData,
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded'
            }
        })

        return response
    } catch (error) {
        console.error('Failed to login:', error)
        throw createError({ statusCode: 500, statusMessage: 'Login failed' })
    }
})

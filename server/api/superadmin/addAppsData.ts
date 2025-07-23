export default defineEventHandler(async (event) => {
    const config = useRuntimeConfig()
    const token = getHeader(event, 'Authorization')
    const body = await readBody(event)

    // Siapkan header
    const headers: Record<string, string> = {
        Accept: 'application/json',
        'Content-Type': 'application/json'
    }
    if (token) {
        headers['Authorization'] = token
    }

    // Kirim ke backend
    const response = await $fetch(`${config.apiBaseUrl}/user/apps`, {
        method: 'POST',
        body: body,
        headers
    })

    // Cek response untuk debug
    console.log('Response backend:', response)

    // Return response ke client
    return response
})

export default defineEventHandler(async (event) => {
    const config = useRuntimeConfig()
    const { id } = getQuery(event)
    const token = getHeader(event, 'Authorization')
    const formData = await readMultipartFormData(event)

    const headers: Record<string, string> = {
        Accept: 'application/json'
    }
    if (token) {
        headers['Authorization'] = token
    }

    return await $fetch(`${config.apiBaseUrl}/galeri/galeri?id=${id}`, {
        method: 'PUT',
        body: formData,
        headers
    })
})

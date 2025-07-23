export default defineEventHandler(async (event) => {
    const config = useRuntimeConfig()
    const { id } = getQuery(event)
    const token = getHeader(event, 'Authorization')
    const formDataArray = await readMultipartFormData(event)

    // Konversi ke FormData agar bisa dikirim ke backend
    const formData = new FormData()
    formDataArray?.forEach(item => {
        if (typeof item.name === 'string') {
            if (item.filename) {
                // If it's a file, convert Buffer to Blob
                const blob = new Blob([new Uint8Array(item.data)], { type: item.type || 'application/octet-stream' });
                formData.append(item.name, blob, item.filename);
            } else {
                // If it's a text field, convert Buffer to string
                formData.append(item.name, item.data.toString());
            }
        }
    })

    const headers: Record<string, string> = {
        Accept: 'application/json'
    }
    if (token) {
        headers['Authorization'] = token
    }

    return await $fetch(`${config.apiBaseUrl}/artikel/artikel?id=${id}`, {
        method: 'PUT',
        body: formData,
        headers
    })
})

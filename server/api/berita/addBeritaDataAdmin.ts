export default defineEventHandler(async (event) => {
    const config = useRuntimeConfig()
    const token = getHeader(event, 'Authorization')

    // Ambil multipart data dari form
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

    // Siapkan header
    const headers: Record<string, string> = {
        Accept: 'application/json'
    }
    if (token) {
        headers['Authorization'] = token
    }

    // Kirim ke backend
    const response = await $fetch(`${config.apiBaseUrl}/artikel/artikel`, {
        method: 'POST',
        body: formData,
        headers
    })

    // Cek response untuk debug
    console.log('Response backend:', response)

    // Return response ke client
    return response
})
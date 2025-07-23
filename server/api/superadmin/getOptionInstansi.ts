export default defineEventHandler(async (event) => {
    const config = useRuntimeConfig()

    return await $fetch(`${config.apiBaseUrl}/pegawai/instansi`, {
        headers: {
            Authorization: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.e30.t-IDcSemACt8x4iTMCda8Yhe3iZaWbvV5XKSTbuAn0M",
            'Content-Type': 'application/json'
        }
    })
})

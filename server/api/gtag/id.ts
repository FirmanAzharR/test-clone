export default defineEventHandler((event) => {
  const config = useRuntimeConfig()
  return {
    gtagId: config.public.GOOGLE_GTAG_ID
  }
})

export default defineEventHandler((event) => {
  const config = useRuntimeConfig()
  const gtagId = config.public.GOOGLE_GTAG_ID
  
  return sendRedirect(event, `https://www.googletagmanager.com/gtag/js?id=${gtagId}`, 302)
})

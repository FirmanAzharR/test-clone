export default defineEventHandler((event) => {
  const config = useRuntimeConfig()
  return {
    propertyId: config.public.propertyId
  }
})

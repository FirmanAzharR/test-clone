export default defineEventHandler(async (event) => {
  const config = useRuntimeConfig();

  const headers: Record<string, string> = {
    Authorization: config.tokenInAuth,
    Accept: "application/json",
    "Content-Type": "multipart/form-data",
  };

  try {
    return await $fetch(`${config.apiBaseUrl}/skm/questions`, {
      method: "GET",
      headers,
    });
  } catch (error) {
    throw createError({
      statusCode: 500,
      statusMessage: "Failed to fetch questions for frontend",
    });
  }
});

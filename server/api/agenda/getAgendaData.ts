export default defineEventHandler(async (event) => {
  const config = useRuntimeConfig();

  const headers: Record<string, string> = {
    Authorization: config.tokenInAuth,
    Accept: "application/json",
    "Content-Type": "application/json",
  };

  try {
    return await $fetch(`${config.apiBaseUrl}/agenda/agendas`, {
      method: "GET",
      query: {
        publish: 1,
        today: true,
      },
      headers,
    });
  } catch (error) {
    throw createError({
      statusCode: 500,
      statusMessage: "Failed to fetch agenda data",
    });
  }
});

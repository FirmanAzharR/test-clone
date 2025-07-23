export default defineEventHandler(async (event) => {
  const config = useRuntimeConfig();
  const token = getHeader(event, "Authorization");

  if (!token) {
    throw createError({
      statusCode: 401,
      statusMessage: "Authorization token is required",
    });
  }

  const headers: Record<string, string> = {
    Authorization: token,
    Accept: "application/json",
    "Content-Type": "application/json",
  };

  try {
    return await $fetch(`${config.apiBaseUrl}/widget/allwidgets`, {
      method: "GET",
      query: {
        page: 1,
        page_size: 1000000,
      },
      headers,
    });
  } catch (error) {
    throw createError({
      statusCode: 500,
      statusMessage: "Failed to fetch all widget data",
    });
  }
});

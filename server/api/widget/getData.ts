export default defineEventHandler(async (event) => {
  const config = useRuntimeConfig();
  const { id } = getQuery(event);
  const token = getHeader(event, "Authorization");

  if (!id) {
    throw createError({
      statusCode: 400,
      statusMessage: "Widget ID is required",
    });
  }

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
    return await $fetch(`${config.apiBaseUrl}/widget/editwidget/${id}`, {
      method: "GET",
      headers,
    });
  } catch (error) {
    throw createError({
      statusCode: 500,
      statusMessage: "Failed to fetch widget detail",
    });
  }
});

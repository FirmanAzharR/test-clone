export default defineEventHandler(async (event) => {
  const config = useRuntimeConfig();
  const { id } = getQuery(event);
  const token = getHeader(event, "Authorization");

  if (!id) {
    throw createError({
      statusCode: 400,
      statusMessage: "Question ID is required",
    });
  }

  const headers: Record<string, string> = {
    Accept: "application/json",
    "Content-Type": "application/json",
  };

  if (token) {
    headers["Authorization"] = token;
  }

  try {
    return await $fetch(`${config.apiBaseUrl}/skm/editquestion/${id}`, {
      headers,
    });
  } catch (error) {
    throw createError({
      statusCode: 500,
      statusMessage: "Failed to fetch question data",
    });
  }
});

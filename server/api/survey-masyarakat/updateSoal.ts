export default defineEventHandler(async (event) => {
  const config = useRuntimeConfig();
  const { id } = getQuery(event);
  const body = await readBody(event);
  const token = getHeader(event, "Authorization");

  if (!id) {
    throw createError({
      statusCode: 400,
      statusMessage: "Question ID is required",
    });
  }

  if (!token) {
    throw createError({
      statusCode: 401,
      statusMessage: "Authorization token is required",
    });
  }

  const headers: Record<string, string> = {
    Accept: "application/json",
  };

  if (token) {
    headers["Authorization"] = token;
  }

  try {
    return await $fetch(`${config.apiBaseUrl}/skm/question?id=${id}`, {
      method: "PUT",
      body,
      headers,
    });
  } catch (error) {
    throw createError({
      statusCode: 500,
      statusMessage: "Failed to update question",
    });
  }
});

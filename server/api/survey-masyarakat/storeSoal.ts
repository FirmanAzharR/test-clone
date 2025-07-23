export default defineEventHandler(async (event) => {
  const config = useRuntimeConfig();
  const body = await readBody(event);
  const token = getHeader(event, "Authorization");

  if (!token) {
    throw createError({
      statusCode: 401,
      statusMessage: "Authorization token is required",
    });
  }

  if (!body) {
    throw createError({
      statusCode: 400,
      statusMessage: "Request body is required",
    });
  }

  const headers: Record<string, string> = {
    Accept: "application/json",
  };

  if (token) {
    headers["Authorization"] = token;
  }

  try {
    return await $fetch(`${config.apiBaseUrl}/skm/question`, {
      method: "POST",
      body,
      headers,
    });
  } catch (error) {
    throw createError({
      statusCode: 500,
      statusMessage: "Failed to create question",
    });
  }
});

export default defineEventHandler(async (event) => {
  const config = useRuntimeConfig();
  const token = getHeader(event, "Authorization");

  const headers: Record<string, string> = {
    Accept: "application/json",
    "Content-Type": "application/json",
  };

  if (token) {
    headers["Authorization"] = token;
  }

  try {
    return await $fetch(`${config.apiBaseUrl}/skm/allquestions`, {
      headers,
    });
  } catch (error) {
    throw createError({
      statusCode: 500,
      statusMessage: "Failed to fetch all questions",
    });
  }
});

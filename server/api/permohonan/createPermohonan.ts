export default defineEventHandler(async (event) => {
  const config = useRuntimeConfig();
  const token = getHeader(event, "Authorization");
  const body = await readBody(event);

  const headers: Record<string, string> = {
    Accept: "application/json",
  };

  if (token) {
    headers["Authorization"] = token;
  } else {
    headers["Authorization"] = config.public.tokenInAuth;
  }

  return await $fetch(`${config.apiBaseUrl}/permohonan/permohonan`, {
    method: "POST",
    headers,
    body,
  });
});

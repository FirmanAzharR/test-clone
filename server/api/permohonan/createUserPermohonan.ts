export default defineEventHandler(async (event) => {
  const config = useRuntimeConfig();
  const body = await readBody(event);

  const headers: Record<string, string> = {
    Accept: "application/json",
    Authorization: config.public.tokenInAuth,
  };

  return await $fetch(`${config.apiBaseUrl}/permohonan/permohonan`, {
    method: "POST",
    headers,
    body,
  });
});

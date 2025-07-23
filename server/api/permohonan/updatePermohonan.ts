export default defineEventHandler(async (event) => {
  const config = useRuntimeConfig();
  const { id } = getQuery(event);
  const token = getHeader(event, "Authorization");
  const body = await readBody(event);

  const headers: Record<string, string> = {
    Accept: "application/json",
  };

  if (token) {
    headers["Authorization"] = token;
  }

  return await $fetch(`${config.apiBaseUrl}/permohonan/permohonan?id=${id}`, {
    method: "PUT",
    headers,
    body,
  });
});

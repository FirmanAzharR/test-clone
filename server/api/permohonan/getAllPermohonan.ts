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

  return await $fetch(`${config.apiBaseUrl}/permohonan/allpermohonans`, {
    headers,
  });
});

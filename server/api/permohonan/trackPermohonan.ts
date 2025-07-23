export default defineEventHandler(async (event) => {
  const config = useRuntimeConfig();
  const { no_permohonan } = getQuery(event);

  const headers: Record<string, string> = {
    Accept: "application/json",
    "Content-Type": "application/json",
    Authorization: config.public.tokenInAuth,
  };

  return await $fetch(
    `${config.apiBaseUrl}/permohonan/permohonan/${no_permohonan}`,
    {
      headers,
    },
  );
});

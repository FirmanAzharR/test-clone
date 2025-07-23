export default defineEventHandler(async (event) => {
  const config = useRuntimeConfig();
  const { instansi_id } = getQuery(event);

  if (!instansi_id) {
    throw createError({
      statusCode: 400,
      statusMessage: "Instansi ID is required",
    });
  }

  const token =
    "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.e30.t-IDcSemACt8x4iTMCda8Yhe3iZaWbvV5XKSTbuAn0M";

  const headers: Record<string, string> = {
    Authorization: token,
    Accept: "application/json",
    "Content-Type": "application/json",
  };

  try {
    return await $fetch(
      `${config.apiBaseUrl}/pegawai/pegawaiall/${instansi_id}`,
      {
        method: "GET",
        headers,
      },
    );
  } catch (error) {
    throw createError({
      statusCode: 500,
      statusMessage: "Failed to fetch persons data",
    });
  }
});

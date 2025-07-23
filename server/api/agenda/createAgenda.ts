interface AgendaCreatePayload {
  kegiatan: string;
  lokasi: string;
  person: string | number;
  publish: string;
  created_at: string;
}

export default defineEventHandler(async (event) => {
  const config = useRuntimeConfig();
  const body = (await readBody(event)) as AgendaCreatePayload;
  const token = getHeader(event, "Authorization");

  if (!token) {
    throw createError({
      statusCode: 401,
      statusMessage: "Authorization token is required",
    });
  }

  if (!body.kegiatan || !body.lokasi) {
    throw createError({
      statusCode: 400,
      statusMessage: "Kegiatan and lokasi are required",
    });
  }

  const apiData = {
    kegiatan: body.kegiatan.trim(),
    lokasi: body.lokasi.trim(),
    person: body.person,
    publish: String(body.publish),
    created_at: body.created_at.replace("T", " ").replace("Z", ""),
  };

  const headers: Record<string, string> = {
    Authorization: token,
    Accept: "application/json",
    "Content-Type": "application/json",
  };

  try {
    return await $fetch(`${config.apiBaseUrl}/agenda/agenda/`, {
      method: "POST",
      body: apiData,
      headers,
    });
  } catch (error) {
    throw createError({
      statusCode: 500,
      statusMessage: "Failed to create agenda",
    });
  }
});

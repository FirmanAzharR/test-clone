interface AgendaUpdatePayload {
  kegiatan: string;
  lokasi: string;
  person: string | number;
  publish: string;
  created_at: string;
}

export default defineEventHandler(async (event) => {
  const config = useRuntimeConfig();
  const { id } = getQuery(event);
  const body = (await readBody(event)) as AgendaUpdatePayload;
  const token = getHeader(event, "Authorization");

  if (!id) {
    throw createError({
      statusCode: 400,
      statusMessage: "Agenda ID is required",
    });
  }

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

  // Process timezone offset
  const date = new Date(body.created_at);
  const offset = -date.getTimezoneOffset();
  const hours = Math.floor(Math.abs(offset) / 60);
  const minutes = Math.abs(offset) % 60;
  const tzString = `${offset >= 0 ? "+" : "-"}${String(hours).padStart(
    2,
    "0",
  )}:${String(minutes).padStart(2, "0")}`;

  const apiData = {
    kegiatan: body.kegiatan.trim(),
    lokasi: body.lokasi.trim(),
    person: body.person,
    publish: String(body.publish),
    created_at: body.created_at.replace("Z", tzString),
  };

  const headers: Record<string, string> = {
    Authorization: token,
    Accept: "application/json",
    "Content-Type": "application/json",
  };

  try {
    return await $fetch(`${config.apiBaseUrl}/agenda/agenda/${id}`, {
      method: "PUT",
      body: apiData,
      headers,
    });
  } catch (error) {
    throw createError({
      statusCode: 500,
      statusMessage: "Failed to update agenda",
    });
  }
});

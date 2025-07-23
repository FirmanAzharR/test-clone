export default defineEventHandler(async (event) => {
  const config = useRuntimeConfig();
  const token = getHeader(event, "Authorization");

  if (!token) {
    throw createError({
      statusCode: 401,
      statusMessage: "Authorization token is required",
    });
  }

  // Handle multipart/form-data
  const formData = await readMultipartFormData(event);

  if (!formData) {
    throw createError({
      statusCode: 400,
      statusMessage: "Form data is required",
    });
  }

  // Convert multipart data to FormData for external API
  const apiFormData = new FormData();

  formData.forEach((field) => {
    if (field.filename) {
      // Handle file upload
      const blob = new Blob([field.data], { type: field.type });
      apiFormData.append(field.name || "file", blob, field.filename);
    } else {
      // Handle regular form fields
      apiFormData.append(field.name || "field", field.data.toString());
    }
  });

  const headers: Record<string, string> = {
    Authorization: token,
    Accept: "application/json",
    // Don't set Content-Type for FormData, let the browser set it with boundary
  };

  try {
    return await $fetch(`${config.apiBaseUrl}/widget/widget`, {
      method: "POST",
      body: apiFormData,
      headers,
    });
  } catch (error) {
    throw createError({
      statusCode: 500,
      statusMessage: "Failed to create widget",
    });
  }
});

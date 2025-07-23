interface AnswerPayload {
  qid: string | number;
  user_id: string | number;
  opt_value: string | number;
}

export default defineEventHandler(async (event) => {
  const config = useRuntimeConfig();
  const body = (await readBody(event)) as AnswerPayload;

  if (!body.qid || !body.opt_value) {
    throw createError({
      statusCode: 400,
      statusMessage: "Question ID and option value are required",
    });
  }

  const headers: Record<string, string> = {
    Accept: "application/json",
    "Content-Type": "application/json",
  };

  try {
    return await $fetch(`${config.apiBaseUrl}/skm/answersfromfe`, {
      method: "POST",
      body,
      headers,
    });
  } catch (error) {
    throw createError({
      statusCode: 500,
      statusMessage: "Failed to submit answer",
    });
  }
});

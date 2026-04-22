export type ApiErrorBody = {
  error: { code: string; message: string; details?: unknown };
};

export function jsonError(
  code: string,
  message: string,
  status: number,
  details?: unknown,
): Response {
  const body: ApiErrorBody = { error: { code, message, details } };
  return new Response(JSON.stringify(body), {
    status,
    headers: { 'content-type': 'application/json' },
  });
}

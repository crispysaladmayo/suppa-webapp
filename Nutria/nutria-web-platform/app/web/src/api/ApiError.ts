export type ApiErrorCode =
  | 'conflict'
  | 'unauthorized'
  | 'validation'
  | 'not_found'
  | 'server'
  | 'unknown';

export class ApiError extends Error {
  readonly name = 'ApiError';

  constructor(
    message: string,
    readonly status: number,
    readonly code: ApiErrorCode = 'unknown',
  ) {
    super(message);
    Object.setPrototypeOf(this, new.target.prototype);
  }
}

export function isApiError(e: unknown): e is ApiError {
  return e instanceof ApiError;
}

function codeForStatus(status: number): ApiErrorCode {
  if (status === 409) return 'conflict';
  if (status === 401 || status === 403) return 'unauthorized';
  if (status === 400 || status === 422) return 'validation';
  if (status === 404) return 'not_found';
  if (status >= 500) return 'server';
  return 'unknown';
}

export function createApiError(message: string, status: number): ApiError {
  return new ApiError(message, status, codeForStatus(status));
}

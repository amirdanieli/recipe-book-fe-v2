const BASE_URL = import.meta.env.VITE_API_URL ?? "/api";

/** Error thrown for any non-2xx response, carrying the HTTP status. */
export class ApiError extends Error {
  readonly status: number;
  readonly details: unknown;

  constructor(message: string, status: number, details?: unknown) {
    super(message);
    this.name = "ApiError";
    this.status = status;
    this.details = details;
  }
}

export const isNotFoundError = (error: unknown): boolean =>
  error instanceof ApiError && error.status === 404;

export const getErrorMessage = (error: unknown, fallback: string): string =>
  error instanceof Error && error.message ? error.message : fallback;

export interface RequestOptions extends Omit<RequestInit, "body" | "headers"> {
  /** Plain objects are sent as JSON; FormData is sent as multipart. */
  body?: object | FormData;
  headers?: Record<string, string>;
}

/** Reads the body once, tolerating empty (204) and non-JSON responses. */
const parseBody = async (response: Response): Promise<unknown> => {
  const text = await response.text();
  if (!text) return undefined;
  try {
    return JSON.parse(text);
  } catch {
    return text;
  }
};

const extractMessage = (data: unknown, fallback: string): string => {
  if (data && typeof data === "object" && "message" in data) {
    const { message } = data as { message: unknown };
    if (typeof message === "string") return message;
    // NestJS validation errors return an array of messages.
    if (Array.isArray(message)) return message.join(", ");
  }
  return fallback;
};

export const apiClient = async <T>(
  endpoint: string,
  options: RequestOptions = {},
): Promise<T> => {
  const { body, headers, ...rest } = options;
  const isFormData = body instanceof FormData;

  const response = await fetch(`${BASE_URL}${endpoint}`, {
    method: body ? "POST" : "GET",
    ...rest,
    headers: {
      // For FormData the browser sets the multipart boundary itself.
      ...(body && !isFormData ? { "Content-Type": "application/json" } : {}),
      ...headers,
    },
    body: body === undefined ? undefined : isFormData ? body : JSON.stringify(body),
    // The JWT lives in an httpOnly `token` cookie, which JS cannot read;
    // `include` makes the browser send it along.
    credentials: "include",
  });

  const data = await parseBody(response);

  if (!response.ok) {
    throw new ApiError(
      extractMessage(data, `Request failed (${response.status})`),
      response.status,
      data,
    );
  }

  return data as T;
};

const BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:3000/api";

interface RequestOptions extends RequestInit {
  body?: any;
}

export const apiClient = async <T>(endpoint: string, options: RequestOptions = {}): Promise<T> => {
  const { body, ...customConfig } = options;
  const headers: Record<string, string> = {
    "Content-Type": "application/json",
  };

  const config: RequestInit = {
    method: body ? "POST" : "GET",
    ...customConfig,
    headers: {
      ...headers,
      ...customConfig.headers,
    },
    credentials: "include",
  };

  if (body && !(body instanceof FormData)) {
    config.body = JSON.stringify(body);
  } else if (body instanceof FormData) {
    // Let the browser set the Content-Type for FormData
    delete (config.headers as Record<string, string>)["Content-Type"];
    config.body = body;
  }

  const response = await fetch(`${BASE_URL}${endpoint}`, config);

  if (response.status === 204) {
    return {} as T;
  }

  const data = await response.json();

  if (response.ok) {
    return data;
  } else {
    console.error(`API Error: ${response.status}`, data);
    throw new Error(data.message || "Something went wrong");
  }
};

export interface User {
  id: string;
  email: string;
  role: "ADMIN";
}

export interface LoginResponse {
  user: User;
  message: string;
}

export interface ErrorResponse {
  message: string;
  errors?: Record<string, string[]>;
}

export interface LoginResponse {
  token: string;
  username: string;
  email: string;
  fullName: string;
  role: string;
  refreshToken: string;
  expiresAt: string;
}

export interface LoginRequest {
  identifier: string; // Email or Username
  password: string;
  rememberMe: boolean;
}

export interface User {
  fullName: string;
  role: string;
  email?: string;
  avatarUrl?: string;
}
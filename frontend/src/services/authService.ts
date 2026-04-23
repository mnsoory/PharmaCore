import axiosClient from '../api/axiosClient';
import type { LoginRequest, LoginResponse } from '../types/auth';

export const authService = {
  login: async (credentials: LoginRequest): Promise<LoginResponse> => {
    const response = await axiosClient.post<LoginResponse>('/users/login', credentials);
    return response.data;
  },

  logout: async () => {
    try {
      await axiosClient.post("/users/logout");
    } finally {
      localStorage.removeItem("token");
      localStorage.removeItem("user");
      window.location.replace('/login');
    }
  },
};
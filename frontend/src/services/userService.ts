import axiosClient from "@/api/axiosClient";
import type {
  ChangePasswordPayload,
  CreateUserPayload,
  ResetPasswordPayload,
  UpdateRolePayload,
  UpdateUserPayload,
  User,
} from "@/types/user";

export const userService = {
  getAll: async (): Promise<User[]> => {
    const { data } = await axiosClient.get<User[]>("/users");
    return data;
  },

  getById: async (id: number): Promise<User> => {
    const { data } = await axiosClient.get<User>(`/users/${id}`);
    return data;
  },

  getByUsername: async (username: string): Promise<User> => {
    const { data } = await axiosClient.get<User>(`/users/username/${username}`);
    return data;
  },

  create: async (payload: CreateUserPayload): Promise<User> => {
    const { data } = await axiosClient.post<User>("/users", payload);
    return data;
  },

  update: async (id: number, payload: UpdateUserPayload): Promise<void> => {
    await axiosClient.put(`/users/${id}`, payload);
  },

  updateRole: async (id: number, payload: UpdateRolePayload): Promise<void> => {
    await axiosClient.patch(`/users/${id}/role`, payload);
  },

  toggleStatus: async (id: number): Promise<boolean> => {
    const { data } = await axiosClient.patch<boolean>(`/users/${id}/status`);
    return data;
  },

  changePassword: async (payload: ChangePasswordPayload): Promise<void> => {
    await axiosClient.patch("/users/password", payload);
  },

  resetPassword: async (id: number, payload: ResetPasswordPayload): Promise<void> => {
    await axiosClient.patch(`/users/${id}/reset-password`, payload);
  },

  delete: async (id: number): Promise<void> => {
    await axiosClient.delete(`/users/${id}`);
  },
};

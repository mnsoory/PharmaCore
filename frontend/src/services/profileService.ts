import axiosClient from "@/api/axiosClient";
import type { User } from "@/types/user";

export const profileService = {
    getProfile: async (): Promise<User> => {
    const { data } = await axiosClient.get<User>("/users/profile");
    return data;
  },
}
export type UserRole = "Assistant" | "Pharmacist" | "Admin";

export interface User {
  userId: number;
  username: string;
  firstname: string;
  lastname: string;
  fullName: string;
  email: string;
  phone?: string | null;
  role: UserRole;
  isActive: boolean;
  joinedAt: string;
}

export interface CreateUserPayload {
  username: string;
  firstname: string;
  lastname: string;
  email: string;
  phone?: string | null;
  password: string;
  passwordConfirmation: string;
  role: UserRole;
}

export interface UpdateUserPayload {
  firstname: string;
  lastname: string;
  email: string;
  phone?: string | null;
}

export interface ChangePasswordPayload {
  currentPassword: string;
  newPassword: string;
  passwordConfirmation: string;
}

export interface ResetPasswordPayload {
  newPassword: string;
  passwordConfirmation: string;
}

export interface UpdateRolePayload {
  newRole: UserRole;
}

export type StaffFilter = "all" | "active" | "inactive";

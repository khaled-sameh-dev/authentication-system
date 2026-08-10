import { apiClient } from "@/config/axios";
import type { LoginInput } from "../schemas/login.schema";
import type { LoginResponse } from "@/types/auth.types";

export const loginApi = async (data: LoginInput): Promise<LoginResponse> => {
  const response = await apiClient.post<LoginResponse>("/auth/login", data);
  return response.data;
};

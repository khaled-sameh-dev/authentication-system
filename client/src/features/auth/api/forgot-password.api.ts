import { apiClient } from "@/config/axios";
import type { ForgotPasswordInput } from "../schemas/forgot-password.schema";
import type { ForgotPasswordResponse } from "@/types/auth.types";

export const forgotPasswordApi = async (
  data: ForgotPasswordInput,
): Promise<ForgotPasswordResponse> => {
  const response = await apiClient.post<ForgotPasswordResponse>(
    "/auth/forgot-password",
    data,
  );
  return response.data;
};

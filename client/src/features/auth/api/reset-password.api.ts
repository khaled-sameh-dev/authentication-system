import { apiClient } from "@/config/axios";
import type { ResetPasswordInput } from "../schemas/reset-password.schema";
import type { ResetPasswordResponse } from "@/types/auth.types";

interface ResetPasswordPayload extends ResetPasswordInput {
  token: string;
}

export const resetPasswordApi = async (
  data: ResetPasswordPayload,
): Promise<ResetPasswordResponse> => {
  const { ...payload } = data;

  const response = await apiClient.post<ResetPasswordResponse>(
    "/auth/reset-password",
    payload,
  );
  return response.data;
};

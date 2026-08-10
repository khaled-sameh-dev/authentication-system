import { apiClient } from "@/config/axios";

import type { ChangePasswordResponse } from "@/types/auth.types";
import type { ChangePasswordInput } from "../schemas/change-password.schema";

export const changePasswordApi = async (
  data: ChangePasswordInput,
): Promise<ChangePasswordResponse> => {
  const { confirmNewPassword: _confirmNewPassword, ...payload } = data;

  const response = await apiClient.post<ChangePasswordResponse>(
    "/auth/change-password",
    payload,
  );
  return response.data;
};

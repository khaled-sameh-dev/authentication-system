import { apiClient } from "@/config/axios";
import type { ResendVerificationResponse } from "@/types/auth.types";

export const resendVerificationApi =
  async (): Promise<ResendVerificationResponse> => {
    const response = await apiClient.post<ResendVerificationResponse>(
      "/auth/resend-verification",
    );
    return response.data;
  };

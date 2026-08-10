import { apiClient } from "@/config/axios";
import type { RefreshTokenResponse } from "@/types/auth.types";

export const exchangeOAuthSessionApi =
  async (): Promise<RefreshTokenResponse> => {
    const response = await apiClient.post<RefreshTokenResponse>(
      "/auth/refresh-token",
    );
    return response.data;
  };

import { apiClient } from "@/config/axios";
import type { VerifyEmailResponse } from "@/types/auth.types";

export const verifyEmailApi = async (
  token: string,
): Promise<VerifyEmailResponse> => {
  console.log("veriy token" , token)
  const response = await apiClient.post<VerifyEmailResponse>(
    "/auth/verify-email",
     {token} ,
  );
  console.log("res verify" , response)
  return response.data;
};

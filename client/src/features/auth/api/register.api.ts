import { apiClient } from "@/config/axios";
import type { RegisterInput } from "../schemas/register.schema";
import type { RegisterResponse } from "@/types/auth.types";

export const registerApi = async (
  data: RegisterInput,
): Promise<RegisterResponse> => {
  const { ...registerPayload } = data;

  const response = await apiClient.post<RegisterResponse>(
    "/auth/register",
    registerPayload,
  );
  console.log(response)
  return response.data ;
};

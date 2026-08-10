import { useMutation } from "@tanstack/react-query";
import { AxiosError } from "axios";
import type { ResetPasswordInput } from "../schemas/reset-password.schema";
import type {
  ApiErrorResponse,
  ResetPasswordResponse,
} from "@/types/auth.types";
import { resetPasswordApi } from "../api/reset-password.api";

interface ResetPasswordVariables extends ResetPasswordInput {
  token: string;
}

export const useResetPassword = () => {
  return useMutation<
    ResetPasswordResponse,
    AxiosError<ApiErrorResponse>,
    ResetPasswordVariables
  >({
    mutationFn: resetPasswordApi,
  });
};

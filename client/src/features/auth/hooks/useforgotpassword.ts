import { useMutation } from "@tanstack/react-query";
import { AxiosError } from "axios";

import type {
  ApiErrorResponse,
  ForgotPasswordResponse,
} from "@/types/auth.types";
import type { ForgotPasswordInput } from "@/schemas/forgot-password.schema";
import { forgotPasswordApi } from "../api/forgot-password.api";

export const useForgotPassword = () => {
  return useMutation<
    ForgotPasswordResponse,
    AxiosError<ApiErrorResponse>,
    ForgotPasswordInput
  >({
    mutationFn: forgotPasswordApi,
  });
};

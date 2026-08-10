import { useMutation } from "@tanstack/react-query";
import { AxiosError } from "axios";

import type {
  ApiErrorResponse,
  ChangePasswordResponse,
} from "@/types/auth.types";
import type { ChangePasswordInput } from "../schemas/change-password.schema";
import { changePasswordApi } from "../api/change-password.pi";

export const useChangePassword = () => {
  return useMutation<
    ChangePasswordResponse,
    AxiosError<ApiErrorResponse>,
    ChangePasswordInput
  >({
    mutationFn: changePasswordApi,
  });
};

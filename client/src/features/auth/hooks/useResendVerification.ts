import { useMutation } from "@tanstack/react-query";
import { AxiosError } from "axios";
import { toast } from "sonner";

import { resendVerificationApi } from "../api/resendVerification.api";

import type {
  ApiErrorResponse,
  ResendVerificationResponse,
} from "@/types/auth.types";

export const useResendVerification = () => {
  return useMutation<
    ResendVerificationResponse,
    AxiosError<ApiErrorResponse>,
    void
  >({
    mutationFn: resendVerificationApi,

    onSuccess: (data) => {
      toast.success(data.message ?? "Verification email sent!");
    },

    onError: (error) => {
      toast.error(
        error.response?.data?.message ?? "Failed to resend verification email.",
      );
    },
  });
};

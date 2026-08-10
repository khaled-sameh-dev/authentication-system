import { useMutation } from "@tanstack/react-query";
import { AxiosError } from "axios";
import { toast } from "sonner";

import { verifyEmailApi } from "../api/verifyEmail.api";
import { useAuth } from "@/hooks/useAuth";

import type { ApiErrorResponse, VerifyEmailResponse } from "@/types/auth.types";

export const useVerifyEmail = () => {
  const { setVerified } = useAuth();

  return useMutation<VerifyEmailResponse, AxiosError<ApiErrorResponse>, string>(
    {
      mutationFn: verifyEmailApi,
      retry: false,
      onSuccess: () => {
        setVerified();
      },
      onError: (error) => {
        toast.error(
          error.response?.data?.message ??
            "This verification link is invalid or has expired.",
        );
      },
    },
  );
};

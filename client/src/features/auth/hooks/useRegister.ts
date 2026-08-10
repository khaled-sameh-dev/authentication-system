import { useMutation } from "@tanstack/react-query";
import { useNavigate } from "react-router";
import { toast } from "sonner";
import { AxiosError } from "axios";

import { registerApi } from "../api/register.api";
import { useAuth } from "@/hooks/useAuth";

import type { ApiErrorResponse, RegisterResponse } from "@/types/auth.types";
import type { RegisterInput } from "../schemas/register.schema";

export const useRegister = () => {
  const { setAuth } = useAuth();
  const navigate = useNavigate();

  return useMutation<
    RegisterResponse,
    AxiosError<ApiErrorResponse>,
    RegisterInput
  >({
    mutationFn: registerApi,

    onSuccess: (response) => {
      const {accessToken } = response.data;

      setAuth( accessToken);
      toast.success(response.message ?? "Account created successfully!");

      navigate("/verify-email", { replace: true });
    },

    onError: (error) => {
      toast.error(
        error.response?.data?.message ??
          "Failed to create account. Please try again.",
      );
    },
  });
};

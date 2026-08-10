import { useMutation } from "@tanstack/react-query";
import { useLocation, useNavigate } from "react-router";
import { toast } from "sonner";
import { AxiosError } from "axios";

import { loginApi } from "../api/login.api";
import { useAuth } from "@/hooks/useAuth";
import { authStore } from "@/store/auth.store";

import type { ApiErrorResponse, LoginResponse } from "@/types/auth.types";
import type { LoginInput } from "../schemas/login.schema";

export const useLogin = () => {
  const { setAuth } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  return useMutation<LoginResponse, AxiosError<ApiErrorResponse>, LoginInput>({
    mutationFn: loginApi,
    onSuccess: (response) => {
      const { accessToken } = response.data;

      
      setAuth(accessToken);
      const user = authStore.getUser();

      toast.success(response.message || "Logged in successfully!");

      if (!user?.isVerified) {
        navigate("/verify-email", { replace: true });
        return;
      }

      const redirectTo =
        (location.state as { from?: string } | null)?.from ?? "/";

      navigate(redirectTo, { replace: true });
    },
    onError: (error) => {
      const errorMessage =
        error.response?.data?.message ||
        "Failed to log in. Please check your credentials.";
      toast.error(errorMessage);
    },
  });
};

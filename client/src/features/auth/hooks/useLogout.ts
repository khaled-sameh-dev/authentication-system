// src/features/auth/hooks/useLogout.ts
import { useMutation } from "@tanstack/react-query";
import { useNavigate } from "react-router";
import { useAuth } from "@/hooks/useAuth";

export const useLogout = () => {
  const { logout } = useAuth();
  const navigate = useNavigate();

  return useMutation({
    mutationFn: logout,
    onSuccess: () => navigate("/login", { replace: true }),
  });
};

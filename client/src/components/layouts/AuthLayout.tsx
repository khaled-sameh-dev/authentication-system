import { useAuth } from "@/hooks/useAuth";
import { useEffect, useRef, type ReactNode } from "react";
import { useNavigate } from "react-router";
import AuthShell from "./AuthShell";

const AuthLayout = ({ children }: { children: ReactNode }) => {
  const { isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const wasAuthenticatedOnMount = useRef(isAuthenticated);

  useEffect(() => {
    if (wasAuthenticatedOnMount.current) {
      navigate("/", { replace: true });
    }
  }, [wasAuthenticatedOnMount]);

  if (isAuthenticated) {
    return null;
  }

  return <AuthShell>{children}</AuthShell>;
};

export default AuthLayout;

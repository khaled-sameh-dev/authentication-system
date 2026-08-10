import { useEffect, useRef, useState } from "react";
import { useNavigate, useSearchParams } from "react-router";
import { toast } from "sonner";

import { useAuth } from "@/hooks/useAuth";
import { authStore } from "@/store/auth.store";
import { exchangeOAuthSessionApi } from "@/features/auth/api/oauthCallback.api";

import PageLoader from "@/components/ui/PageLoader";

export default function OAuthCallbackPage() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { setAuth } = useAuth();
  const [hasFailed, setHasFailed] = useState(false);

  const hasTriggered = useRef(false);

  useEffect(() => {
    if (hasTriggered.current) return;
    hasTriggered.current = true;

    const errorParam = searchParams.get("error");

    if (errorParam) {
      toast.error("OAuth sign-in failed. Please try again.");
      navigate("/login", { replace: true });
      return;
    }

    const completeOAuthLogin = async () => {
      try {
        const { data } = await exchangeOAuthSessionApi();

        setAuth(data.accessToken);

        const user = authStore.getUser();

        if (!user?.isVerified) {
          navigate("/verify-email", { replace: true });
          return;
        }

        navigate("/", { replace: true });
      } catch {
        setHasFailed(true);
        toast.error("Could not complete sign-in. Please try again.");
        setTimeout(() => navigate("/login", { replace: true }), 1500);
      }
    };

    completeOAuthLogin();
  }, [navigate, searchParams, setAuth]);

  return (
    <PageLoader
      message={
        hasFailed ? "Sign-in failed, redirecting..." : "Completing sign-in..."
      }
    />
  );
}

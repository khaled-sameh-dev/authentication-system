import { useEffect, useRef, useState } from "react";
import { Link, Navigate, useNavigate, useSearchParams } from "react-router";
import { toast } from "sonner";
import { AxiosError } from "axios";
import { CheckCircle2, XCircle } from "lucide-react";

import { useVerifyEmail } from "@/features/auth/hooks/useVerifyEmail";

import PageLoader from "@/components/ui/PageLoader";
import { Card } from "@/components/ui/Card";
import Button from "@/components/ui/Button";

import type { ApiErrorResponse } from "@/types/auth.types";

type Status = "verifying" | "success" | "error";

const DEFAULT_ERROR_MESSAGE =
  "This verification link is invalid or has expired.";

export default function VerifyEmailConfirmPage() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const token = searchParams.get("token");

  const hasTriggered = useRef(false);
  const redirectRef = useRef<number | null>(null);

  const [status, setStatus] = useState<Status>("verifying");
  const [errorMessage, setErrorMessage] = useState<string>(
    DEFAULT_ERROR_MESSAGE,
  );

  const { mutateAsync: verifyEmail } = useVerifyEmail();

  useEffect(() => {
    if (!token || hasTriggered.current) return;
    hasTriggered.current = true;

    const run = async () => {
      try {
        await verifyEmail(token);

        setStatus("success");
        toast.success("Email verified successfully!");

        redirectRef.current = window.setTimeout(() => {
          navigate("/", { replace: true });
        }, 2000);
      } catch (error) {
        const axiosError = error as AxiosError<ApiErrorResponse>;
        const message =
          axiosError.response?.data?.message ?? DEFAULT_ERROR_MESSAGE;

        setErrorMessage(message);
        setStatus("error");
      }
    };

    run();

    return () => {
      if (redirectRef.current !== null) clearTimeout(redirectRef.current);
    };
  }, [token, verifyEmail, navigate]);

  if (!token) return <Navigate to="/verify-email" replace />;

  // مصدر واحد بس للـ truth هنا: status المحلي، مفيش أي اعتماد على isPending
  if (status === "verifying") {
    return <PageLoader message="Verifying your email..." />;
  }

  return (
    <Card>
      <div className="space-y-4 text-left">
        {status === "success" ? (
          <>
            <div className="flex justify-center">
              <CheckCircle2 className="h-12 w-12 text-emerald-500" />
            </div>
            <h2 className="text-center text-xl font-bold text-slate-900">
              Email Verified
            </h2>
            <p className="text-center text-sm text-slate-500">
              Your email has been verified successfully. Redirecting you to the
              home page...
            </p>
          </>
        ) : (
          <>
            <div className="flex justify-center">
              <XCircle className="h-12 w-12 text-red-500" />
            </div>
            <h2 className="text-center text-xl font-bold text-slate-900">
              Verification Failed
            </h2>
            <p className="text-center text-sm text-slate-500">{errorMessage}</p>

            <div className="flex flex-col gap-2 pt-2">
              <Link to="/verify-email">
                <Button type="button" variant="primary" className="w-full">
                  Request New Link
                </Button>
              </Link>
              <Link
                to="/"
                className="w-full py-2 text-center text-sm font-medium text-slate-500 underline transition-colors hover:text-slate-700"
              >
                Skip for now
              </Link>
            </div>
          </>
        )}
      </div>
    </Card>
  );
}

import { useState } from "react";
import { Link, useNavigate, useSearchParams } from "react-router";
import { toast } from "sonner";
import { Card } from "@/components/ui/Card";
import PageLoader from "@/components/ui/PageLoader";
import { useResetPassword } from "@/features/auth/hooks/useResetPassword";
import type { ResetPasswordInput } from "@/features/auth/schemas/reset-password.schema";
import ResetPasswordForm from "@/features/auth/components/Resetpasswordform";

export default function ResetPasswordPage() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const token = searchParams.get("token");

  const [isSuccess, setIsSuccess] = useState(false);
  const { mutate: resetPassword, isPending } = useResetPassword();

  if (!token) {
    return (
      <Card>
        <div className="text-left space-y-3">
          <h2 className="text-xl font-bold text-slate-900">
            Invalid reset link
          </h2>
          <p className="text-sm text-slate-500">
            This password reset link is missing or malformed. Please request a
            new one.
          </p>
          <Link
            to="/forgot-password"
            className="inline-block text-sm font-semibold text-emerald-600 hover:underline"
          >
            Request a new link
          </Link>
        </div>
      </Card>
    );
  }

  const handleSubmit = (data: ResetPasswordInput) => {
    resetPassword(
      { ...data, token },
      {
        onSuccess: (response) => {
          setIsSuccess(true);
          toast.success(response.message ?? "Password reset successfully!");
          setTimeout(() => navigate("/login", { replace: true }), 2000);
        },
        onError: (error) => {
          toast.error(
            error.response?.data?.message ??
              "This reset link is invalid or has expired.",
          );
        },
      },
    );
  };

  if (isPending) {
    return <PageLoader message="Resetting your password..." />;
  }

  if (isSuccess) {
    return (
      <Card>
        <div className="text-left space-y-3">
          <h2 className="text-xl font-bold text-slate-900">Password updated</h2>
          <p className="text-sm text-slate-500">
            Your password has been reset. Redirecting you to login...
          </p>
        </div>
      </Card>
    );
  }

  return (
    <Card>
      <div className="mb-6 text-left">
        <h2 className="text-xl font-bold text-slate-900">
          Reset your password
        </h2>
        <p className="text-sm text-slate-500 mt-1">
          Choose a new password for your account
        </p>
      </div>

      <ResetPasswordForm onSubmit={handleSubmit} isPending={isPending} />
    </Card>
  );
}

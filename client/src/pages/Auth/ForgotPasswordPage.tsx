import { useState } from "react";
import { Link } from "react-router";
import { toast } from "sonner";
import { Card } from "@/components/ui/Card";
import type { ForgotPasswordInput } from "@/features/auth/schemas/forgot-password.schema";
import { useForgotPassword } from "@/features/auth/hooks/useforgotpassword";
import ForgotPasswordForm from "@/features/auth/components/Forgotpasswordform";

export default function ForgotPasswordPage() {
  const [isSent, setIsSent] = useState(false);
  const { mutate: sendResetLink, isPending } = useForgotPassword();

  const handleSubmit = (data: ForgotPasswordInput) => {
    sendResetLink(data, {
      onSuccess: (response) => {
        setIsSent(true);
        toast.success(response.message ?? "Reset link sent!");
      },
      onError: (error) => {
        toast.error(
          error.response?.data?.message ??
            "Failed to send reset link. Please try again.",
        );
      },
    });
  };

  if (isSent) {
    return (
      <Card>
        <div className="text-left space-y-3">
          <h2 className="text-xl font-bold text-slate-900">Check your email</h2>
          <p className="text-sm text-slate-500">
            If an account exists for that email, we've sent a link to reset your
            password.
          </p>
          <Link
            to="/login"
            className="inline-block text-sm font-semibold text-emerald-600 hover:underline"
          >
            Back to login
          </Link>
        </div>
      </Card>
    );
  }

  return (
    <Card>
      <div className="mb-6 text-left">
        <h2 className="text-xl font-bold text-slate-900">
          Forgot your password?
        </h2>
        <p className="text-sm text-slate-500 mt-1">
          Enter your email and we'll send you a reset link
        </p>
      </div>

      <ForgotPasswordForm onSubmit={handleSubmit} isPending={isPending} />
    </Card>
  );
}

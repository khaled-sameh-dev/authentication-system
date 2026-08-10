import { useState } from "react";
import { Link } from "react-router";
import { useAuth } from "@/hooks/useAuth";
import { useResendVerification } from "@/features/auth/hooks/useResendVerification";

const EmailVerificationBanner = () => {
  const { user } = useAuth();
  const [isDismissed, setIsDismissed] = useState(false);
  const { mutate: resend, isPending } = useResendVerification();

  if (!user || user.isVerified || isDismissed) {
    return null;
  }

  return (
    <div className="w-full bg-amber-50 border-b border-amber-200 px-4 py-3">
      <div className="max-w-5xl mx-auto flex flex-wrap items-center justify-between gap-3">
        <p className="text-sm text-amber-800">
          Your email address is not verified yet. Verify it to keep your account
          secure.
        </p>
        <div className="flex items-center gap-4">
          <Link
            to="/verify-email"
            className="text-sm font-semibold text-amber-900 underline"
          >
            Verify now
          </Link>
          <button
            type="button"
            onClick={() => resend()}
            disabled={isPending}
            className="text-sm font-semibold text-amber-900 underline disabled:opacity-50"
          >
            {isPending ? "Sending..." : "Resend email"}
          </button>
          <button
            type="button"
            onClick={() => setIsDismissed(true)}
            className="text-sm text-amber-700"
          >
            Dismiss
          </button>
        </div>
      </div>
    </div>
  );
};

export default EmailVerificationBanner;

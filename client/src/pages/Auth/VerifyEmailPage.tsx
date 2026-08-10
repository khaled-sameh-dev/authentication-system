// import { useEffect, useRef, useState } from "react";
// import { Link, useNavigate, useSearchParams } from "react-router";
// import { toast } from "sonner";

// import { useAuth } from "@/hooks/useAuth";
// import { useVerifyEmail } from "@/features/auth/hooks/useVerifyEmail";
// import { useResendVerification } from "@/features/auth/hooks/useResendVerification";

// import PageLoader from "@/components/ui/PageLoader";
// import { Card } from "@/components/ui/Card";
// import Button from "@/components/ui/Button";

// type VerificationStatus = "idle" | "verifying" | "success" | "error";

// export default function VerifyEmailPage() {
//   const [searchParams] = useSearchParams();
//   const navigate = useNavigate();
//   const { isAuthenticated } = useAuth();

//   const token = searchParams.get("token");

//   const hasTriggered = useRef(false);
//   const timeoutRef = useRef<number | null>(null);

//   const [status, setStatus] = useState<VerificationStatus>(
//     token ? "verifying" : "idle",
//   );

//   const { mutate: verifyEmail } = useVerifyEmail();

//   const { mutate: resendVerification, isPending: isResending } =
//     useResendVerification();

//   useEffect(() => {
//     if (!token || hasTriggered.current) return;

//     hasTriggered.current = true;

//     verifyEmail(token, {
//       onSuccess: () => {
//         setStatus("success");
//         toast.success("Email verified successfully!");

//         timeoutRef.current = window.setTimeout(() => {
//           navigate("/", { replace: true });
//         }, 2000);
//       },

//       onError: () => {
//         setStatus("error");
//         toast.error("This verification link is invalid or has expired.");
//       },
//     });

//     return () => {
//       if (timeoutRef.current !== null) {
//         clearTimeout(timeoutRef.current);
//       }
//     };
//   }, [token, verifyEmail, navigate]);

//   const handleResend = () => {
//     resendVerification();
//   };

//   if (status === "verifying") {
//     return <PageLoader message="Verifying your email..." />;
//   }

//   if (status === "idle" && !isAuthenticated) {
//     return (
//       <Card>
//         <div className="space-y-4 text-left">
//           <h2 className="text-xl font-bold text-slate-900">
//             Verify Your Email
//           </h2>
//           <p className="text-sm text-slate-500">
//             Please log in to resend or complete email verification.
//           </p>
//           <Link
//             to="/login"
//             className="inline-block text-sm font-semibold text-emerald-600 hover:underline"
//           >
//             Go to login
//           </Link>
//         </div>
//       </Card>
//     );
//   }

//   return (
//     <Card>
//       <div className="space-y-4 text-left">
//         {status === "success" && (
//           <>
//             <h2 className="text-xl font-bold text-slate-900">Email Verified</h2>

//             <p className="text-sm text-slate-500">
//               Your email has been verified successfully. Redirecting you to the
//               home page...
//             </p>
//           </>
//         )}

//         {status === "error" && (
//           <>
//             <h2 className="text-xl font-bold text-slate-900">
//               Verification Failed
//             </h2>

//             <p className="text-sm text-slate-500">
//               This verification link is invalid or has expired. You can request
//               a new verification email below.
//             </p>
//           </>
//         )}

//         {status === "idle" && (
//           <>
//             <h2 className="text-xl font-bold text-slate-900">
//               Verify Your Email
//             </h2>

//             <p className="text-sm text-slate-500">
//               We've sent a verification link to your email address. Click the
//               link to verify your account. This step is optional—you can skip it
//               and verify later.
//             </p>
//           </>
//         )}

//         <div className="flex flex-col gap-2 pt-2">
//           {status !== "success" && (
//             <Button
//               type="button"
//               variant="primary"
//               onClick={handleResend}
//               loading={isResending}
//               className="w-full"
//             >
//               Resend Verification Email
//             </Button>
//           )}

//           <Link
//             to="/"
//             className="w-full py-2 text-center text-sm font-medium text-slate-500 underline transition-colors hover:text-slate-700"
//           >
//             Skip for now
//           </Link>
//         </div>
//       </div>
//     </Card>
//   );
// }

// src/features/auth/pages/VerifyEmailNoticePage.tsx
import { Link } from "react-router";

import { useAuth } from "@/hooks/useAuth";
import { useResendVerification } from "@/features/auth/hooks/useResendVerification";
import { useCountdown } from "@/hooks/useCountdown";

import { Card } from "@/components/ui/Card";
import Button from "@/components/ui/Button";

const RESEND_COOLDOWN = 60;

export default function VerifyEmailPage() {
  const { user } = useAuth();
  const { mutate: resendVerification, isPending } = useResendVerification();
  const { secondsLeft, isRunning, start } = useCountdown();

  const handleResend = () => {
    resendVerification(undefined, {
      onSuccess: () => start(RESEND_COOLDOWN),
    });
  };

  return (
    <Card>
      <div className="space-y-4 text-left">
        <h2 className="text-xl font-bold text-slate-900">Verify Your Email</h2>

        <p className="text-sm text-slate-500">
          We've sent a verification link to{" "}
          <span className="font-semibold text-slate-700">{user?.email}</span>.
          Click the link to verify your account. This step is optional — you can
          skip it and verify later.
        </p>

        <div className="flex flex-col gap-2 pt-2">
          <Button
            type="button"
            variant="primary"
            onClick={handleResend}
            loading={isPending}
            disabled={isRunning}
            className="w-full"
          >
            {isRunning
              ? `Resend available in ${secondsLeft}s`
              : "Resend Verification Email"}
          </Button>

          <Link
            to="/"
            className="w-full py-2 text-center text-sm font-medium text-slate-500 underline transition-colors hover:text-slate-700"
          >
            Skip for now
          </Link>
        </div>
      </div>
    </Card>
  );
}

// src/components/layouts/ProtectedLayout.tsx
import { useAuth } from "@/hooks/useAuth";
import { type ReactNode } from "react";
import { Navigate } from "react-router";
import PageLoader from "../ui/PageLoader";
import EmailVerificationBanner from "../EmailVerificationBanner";

const ProtectedLayout = ({ children }: { children: ReactNode }) => {
  const { isAuthenticated, isLoading } = useAuth();

  if (isLoading) {
    return <PageLoader message="Session verification is underway..." />;
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  return (
    <div className="min-h-screen bg-slate-50">
      <EmailVerificationBanner />
      <main className="max-w-5xl mx-auto px-4 py-8">{children}</main>
    </div>
  );
};

export default ProtectedLayout;

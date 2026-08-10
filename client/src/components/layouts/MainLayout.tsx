import { type ReactNode } from "react";
import { Link } from "react-router";
import { useAuth } from "@/hooks/useAuth";
import { useLogout } from "@/features/auth/hooks/useLogout";
import EmailVerificationBanner from "../EmailVerificationBanner";

const MainLayout = ({ children }: { children: ReactNode }) => {
  const { user, isAuthenticated } = useAuth();
  const { mutate: logout } = useLogout();

  return (
    <div className="min-h-screen bg-slate-50">
      <header className="border-b border-slate-200 bg-white">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-4">
          <Link to="/" className="text-lg font-bold text-slate-900">
            AuthShop
          </Link>

          <nav className="flex items-center gap-6 text-sm font-medium text-slate-600">
            {isAuthenticated ? (
              <>
                {user?.role === "admin" && (
                  <Link to="/admin" className="text-emerald-600">
                    Admin
                  </Link>
                )}
                <button
                  onClick={() => logout()}
                  className="text-red-500 hover:underline"
                >
                  Log out
                </button>
              </>
            ) : (
              <Link
                to="/login"
                className="rounded-md bg-emerald-500 px-4 py-1.5 text-white hover:bg-emerald-600"
              >
                Log in
              </Link>
            )}
          </nav>
        </div>
      </header>

      {isAuthenticated && !user?.isVerified && <EmailVerificationBanner />}

      <main className="mx-auto max-w-6xl px-4 py-8">{children}</main>
    </div>
  );
};

export default MainLayout;

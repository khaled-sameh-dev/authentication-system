import AuthLayout from "@/components/layouts/AuthLayout";
import AuthShell from "@/components/layouts/AuthShell";
import MainLayout from "@/components/layouts/MainLayout";
import AdminLayout from "@/components/layouts/AdminLayout";
import AccessGuard from "@/components/guards/AccessGuard";

import LoginPage from "@/pages/Auth/LoginPage";
import RegisterPage from "@/pages/Auth/RegisterPage";
import ForgotPasswordPage from "@/pages/Auth/ForgotPasswordPage";
import ResetPasswordPage from "@/pages/Auth/ResetPasswordPage";
import OAuthCallbackPage from "@/pages/Auth/OAuthCallbackPage";
import VerifyEmailPage from "@/pages/Auth/VerifyEmailPage";
import HomePage from "@/pages/HomePage";
import AdminDashboardPage from "@/pages/Admin/AdminDashboardPage";
import Unauthorized from "@/pages/errors/Unauthorized";
import NotFound from "@/pages/errors/NotFound";

import { createBrowserRouter, Outlet, RouterProvider } from "react-router";
import type { RouteMeta } from "./routeMeta.types";
import ProfilePage from "@/pages/ProfilePage";
import VerifyEmailConfirmPage from "@/pages/Auth/VerifyEmailConfirmPage";

const meta = (m: RouteMeta) => m;

const AuthLayoutWrapper = () => (
  <AuthLayout>
    <Outlet />
  </AuthLayout>
);

const MainLayoutWrapper = () => (
  <MainLayout>
    <AccessGuard>
      <Outlet />
    </AccessGuard>
  </MainLayout>
);

const AdminLayoutWrapper = () => (
  <AdminLayout>
    <Outlet />
  </AdminLayout>
);

const router = createBrowserRouter([
  {
    element: <AuthLayoutWrapper />,
    children: [
      { path: "/login", element: <LoginPage /> },
      { path: "/register", element: <RegisterPage /> },
      { path: "/forgot-password", element: <ForgotPasswordPage /> },
      { path: "/reset-password", element: <ResetPasswordPage /> },
    ],
  },

  { path: "/oauth/callback", element: <OAuthCallbackPage /> },

  {
    path: "/verify-email",
    element: (
      <AccessGuard>
        <AuthShell>
          <VerifyEmailPage />
        </AuthShell>
      </AccessGuard>
    ),
    handle: meta({ protected: true, requireUnverified: true }),
  },
  {
    path: "/verify-email/confirm",
    element: (
      <AccessGuard>
        <AuthShell>
          <VerifyEmailConfirmPage />
        </AuthShell>
      </AccessGuard>
    ),
    handle: meta({ protected: true }),
  },

  {
    element: <MainLayoutWrapper />,
    children: [
      { path: "/", element: <HomePage /> },
      {
        path: "/profile",
        element: <ProfilePage />,
        handle: meta({ protected: true }),
      },

      {
        path: "/admin",
        element: <AdminLayoutWrapper />,
        handle: meta({ protected: true, roles: ["admin"] }),
        children: [{ index: true, element: <AdminDashboardPage /> }],
      },

      { path: "/unauthorized", element: <Unauthorized /> },
    ],
  },

  { path: "*", element: <NotFound /> },
]);

export default function AppRoutes() {
  return <RouterProvider router={router} />;
}

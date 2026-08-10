// import { type ReactNode } from "react";
// import { Navigate, useLocation, useMatches } from "react-router";
// import { useAuth } from "@/hooks/useAuth";
// import PageLoader from "@/components/ui/PageLoader";
// import type { RouteMeta } from "@/routes/routeMeta.types";
// import { usePermission } from "@/hooks/usePermission";

// interface AccessGuardProps {
//   children: ReactNode;
// }

// const AccessGuard = ({ children }: AccessGuardProps) => {
//   const { isAuthenticated, isLoading, user } = useAuth();
//   const { can } = usePermission();
//   const location = useLocation();
//   const matches = useMatches();

//   const meta = matches.reduce<RouteMeta>((acc, match) => {
//     const handle = match.handle as RouteMeta | undefined;
//     return { ...acc, ...handle };
//   }, {});

//   const requiresAuth =
//     meta.protected || !!meta.roles?.length || !!meta.permissions?.length;

//   if (!requiresAuth) {
//     return <>{children}</>;
//   }

//   if (isLoading) {
//     return <PageLoader message="Checking your session..." />;
//   }

//   if (!isAuthenticated) {
//     return <Navigate to="/login" replace state={{ from: location.pathname }} />;
//   }

//   if (meta.roles?.length && !meta.roles.includes(user!.role)) {
//     return <Navigate to="/unauthorized" replace />;
//   }

//   if (meta.permissions?.length && !meta.permissions.every(can)) {
//     return <Navigate to="/unauthorized" replace />;
//   }

//   return <>{children}</>;
// };

// export default AccessGuard;

import { type ReactNode } from "react";
import { Navigate, useLocation, useMatches } from "react-router";
import { useAuth } from "@/hooks/useAuth";
import { usePermission } from "@/hooks/usePermission";
import type { RouteMeta } from "@/routes/routeMeta.types";

interface AccessGuardProps {
  children: ReactNode;
}

const AccessGuard = ({ children }: AccessGuardProps) => {
  const { isAuthenticated, user } = useAuth();
  const { can } = usePermission();
  const location = useLocation();
  const matches = useMatches();

  const meta = matches.reduce<RouteMeta>((acc, match) => {
    const handle = match.handle as RouteMeta | undefined;
    return { ...acc, ...handle };
  }, {});


  const requiresAuth =
    meta.protected || !!meta.roles?.length || !!meta.permissions?.length;

  if (!requiresAuth) {
    return <>{children}</>;
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" replace state={{ from: location.pathname }} />;
  }

  if (meta.roles?.length && !meta.roles.includes(user!.role)) {
    return <Navigate to="/unauthorized" replace />;
  }

  if (meta.permissions?.length && !meta.permissions.every(can)) {
    return <Navigate to="/unauthorized" replace />;
  }

  if (meta.requireUnverified && user?.isVerified) {
    return <Navigate to="/" replace />;
  }

  return <>{children}</>;
};

export default AccessGuard;

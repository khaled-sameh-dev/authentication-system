import type { Permission } from "@/config/permissions";
import type { UserRole } from "@/types/auth.types";

export interface RouteMeta {
  protected?: boolean;
  roles?: UserRole[];
  permissions?: Permission[];
  requireUnverified?: boolean;
}

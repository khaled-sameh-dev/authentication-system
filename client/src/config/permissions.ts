import type { UserRole } from "@/types/auth.types";

export type Permission = "reports:view" | "reports:export" | "reports:delete";

export const ROLE_PERMISSIONS: Record<UserRole, Permission[]> = {
  user: [],
  admin: ["reports:view", "reports:export", "reports:delete"],
};

import { ROLE_PERMISSIONS, type Permission } from "@/config/permissions";
import type { IUser } from "@/types/auth.types";

export const userHasPermission = (
  user: IUser | null,
  permission: Permission,
): boolean => {
  if (!user) return false;
  return ROLE_PERMISSIONS[user.role]?.includes(permission) ?? false;
};

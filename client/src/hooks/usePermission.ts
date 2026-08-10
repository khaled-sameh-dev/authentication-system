import type { Permission } from "@/config/permissions";
import { useAuth } from "./useAuth";
import { userHasPermission } from "@/lib/permissions";

export const usePermission = () => {
  const { user } = useAuth();
  return {
    can: (permission: Permission) => userHasPermission(user, permission),
  };
};

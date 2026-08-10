import type { IUser, UserRole } from "@/types/auth.types";

interface DecodedToken {
  exp: number;
  [key: string]: unknown;
}

export const decodeJwtPayload = (token: string): DecodedToken | null => {
  try {
    const payloadPart = token.split(".")[1];
    if (!payloadPart) return null;

    const normalized = payloadPart.replace(/-/g, "+").replace(/_/g, "/");
    const decoded = atob(normalized);
    return JSON.parse(decoded) as DecodedToken;
  } catch {
    return null;
  }
};

export const getTokenExpiryMs = (token: string): number | null => {
  const payload = decodeJwtPayload(token);
  if (!payload?.exp) return null;
  return payload.exp * 1000;
};

interface AuthPayload {
  userId: string;
  name: string;
  email: string;
  role: UserRole;
  isVerified: boolean;
}
export const decodeUserFromToken = (token: string): IUser | null => {
  const payload = decodeJwtPayload(token) as AuthPayload | null;
  if (!payload?.userId || !payload?.role) return null;

  return {
    id: payload.userId,
    email: payload.email,
    isVerified: payload.isVerified,
    name: payload.name,
    role: payload.role,
  };
};

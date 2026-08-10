import { decodeUserFromToken } from "@/lib/jwt";
import type { IUser } from "@/types/auth.types";

export type AuthStatus =
  | "idle"
  | "authenticating"
  | "authenticated"
  | "unauthenticated";

export interface AuthSnapshot {
  status: AuthStatus;
  user: IUser | null;
  accessToken: string | null;
}

type Listener = () => void;

let state: AuthSnapshot = {
  status: "idle",
  user: null,
  accessToken: null,
};

const listeners = new Set<Listener>();

const notify = () => {
  listeners.forEach((listener) => listener());
};

export const authStore = {
  getSnapshot: (): AuthSnapshot => state,
  subscribe: (listener: Listener): (() => void) => {
    listeners.add(listener);
    return () => listeners.delete(listener);
  },

  getAccessToken: (): string | null => state.accessToken,
  getUser: (): IUser | null => state.user,
  getStatus: (): AuthStatus => state.status,

  setAuthenticating: (): void => {
    state = { ...state, status: "authenticating" };
    notify();
  },

  setSession: (accessToken: string): void => {
    const decoded = decodeUserFromToken(accessToken) as any;

    if (!decoded) {
      console.error(
        "authStore.setSession: could not decode a valid user from the token claims",
        { accessToken },
      );
      state = { status: "unauthenticated", user: null, accessToken: null };
      notify();
      return;
    }

    const user: IUser = {
      id: decoded.id ?? decoded.userId ?? "",
      role: decoded.role ?? "user",
      email: decoded.email ?? "",
      name: decoded.name,
      isVerified: decoded.isVerified ?? false,
    };

    state = { status: "authenticated", user, accessToken };
    notify();
  },

  setVerified: () => {
    if (!state.user) return;
    state = {
      ...state,
      user: { ...state.user, isVerified: true },
    };
    notify();
  },

  clearSession: (): void => {
    state = { status: "unauthenticated", user: null, accessToken: null };
    notify();
  },
};

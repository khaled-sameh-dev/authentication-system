import {
  createContext,
  useEffect,
  useState,
  useSyncExternalStore,
  type ReactNode,
} from "react";
import { authStore } from "@/store/auth.store";
import { apiClient } from "@/config/axios";
import { initSilentRefresh } from "@/lib/silentRefresh";
import PageLoader from "@/components/ui/PageLoader";
import type { RefreshTokenResponse, IUser } from "@/types/auth.types";

interface AuthContextValue {
  user: IUser | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  setAuth: (accessToken: string) => void;
  setVerified: () => void;
  logout: () => Promise<void>;
}

export const AuthContext = createContext<AuthContextValue | undefined>(
  undefined,
);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const snapshot = useSyncExternalStore(
    authStore.subscribe,
    authStore.getSnapshot,
  );

  useEffect(() => {
    setIsLoading(snapshot.status == "authenticating");
  }, [snapshot]);

  const logout = async () => {
    try {
      await apiClient.post("/auth/logout");
    } catch {
    } finally {
      authStore.clearSession();
    }
  };

  useEffect(() => {
    const teardown = initSilentRefresh({
      onExpired: () => {
        if (window.location.pathname !== "/login") {
          window.location.href = "/login";
        }
      },
    });

    return teardown;
  }, []);

  useEffect(() => {
    const restoreSession = async () => {
      authStore.setAuthenticating();
      try {
        const { data: response } = await apiClient.post<RefreshTokenResponse>(
          "/auth/refresh-token",
        );
        console.log("refresh res");
        console.log("res", response);
        authStore.setSession(response.data.accessToken);
      } catch {
        authStore.clearSession();
      }
    };

    restoreSession();
  }, []);

  if (snapshot.status === "idle" || snapshot.status === "authenticating") {
    return <PageLoader message="Checking your session..." />;
  }

  const value: AuthContextValue = {
    user: snapshot.user,
    isAuthenticated: snapshot.status === "authenticated",
    isLoading,
    setAuth: authStore.setSession,
    setVerified: authStore.setVerified,
    logout,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

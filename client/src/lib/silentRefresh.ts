import { apiClient } from "@/config/axios";
import { authStore } from "@/store/auth.store";
import { getTokenExpiryMs } from "./jwt";
import type { RefreshTokenResponse } from "@/types/auth.types";

const REFRESH_MARGIN_MS = 60_000;
const MIN_REFRESH_DELAY_MS = 5_000;

let refreshTimeoutId: ReturnType<typeof setTimeout> | null = null;
let lastScheduledToken: string | null = null;
let onSessionExpired: (() => void) | null = null;

const clearScheduledRefresh = () => {
  if (refreshTimeoutId) {
    clearTimeout(refreshTimeoutId);
    refreshTimeoutId = null;
  }
};

const performSilentRefresh = async () => {
  try {
    const { data: response } = await apiClient.post<RefreshTokenResponse>(
      "/auth/refresh-token",
    );

    authStore.setSession(response.data.user, response.data.accessToken);
  } catch {
    authStore.clearSession();
    onSessionExpired?.();
  }
};

const scheduleFromToken = (token: string | null) => {
  clearScheduledRefresh();

  if (!token) {
    lastScheduledToken = null;
    return;
  }

  if (token === lastScheduledToken && refreshTimeoutId) return;
  lastScheduledToken = token;

  const expiryMs = getTokenExpiryMs(token);
  if (!expiryMs) return;

  const delay = Math.max(
    expiryMs - Date.now() - REFRESH_MARGIN_MS,
    MIN_REFRESH_DELAY_MS,
  );

  refreshTimeoutId = setTimeout(performSilentRefresh, delay);
};

export const initSilentRefresh = (options?: {
  onExpired?: () => void;
}): (() => void) => {
  onSessionExpired = options?.onExpired ?? null;

  const unsubscribe = authStore.subscribe(() => {
    scheduleFromToken(authStore.getAccessToken());
  });

  scheduleFromToken(authStore.getAccessToken());

  return () => {
    unsubscribe();
    clearScheduledRefresh();
  };
};

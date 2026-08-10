import { ENV } from "@/config/env.config";

export type OAuthProvider = "google" | "github";

export const getOAuthRedirectUrl = (provider: OAuthProvider): string => {
  return `${ENV.API_BASE_URL}/oauth/${provider}`;
};

export const redirectToOAuthProvider = (provider: OAuthProvider): void => {
  window.location.href = getOAuthRedirectUrl(provider);
};

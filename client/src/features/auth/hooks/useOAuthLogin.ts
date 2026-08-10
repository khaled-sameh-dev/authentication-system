import { redirectToOAuthProvider, type OAuthProvider } from "../api/oauth.api";

export const useOAuthLogin = () => {
  const loginWithProvider = (provider: OAuthProvider) => {
    redirectToOAuthProvider(provider);
  };

  return { loginWithProvider };
};

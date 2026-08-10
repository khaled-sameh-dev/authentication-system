export enum OAuthProvider {
  GOOGLE = "google",
  GITHUB = "github",
}

export interface IOAuthAccount {
  provider: OAuthProvider;
  providerId: string;
}

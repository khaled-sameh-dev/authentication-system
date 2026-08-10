import passport from "passport";
import {
  Strategy as GoogleStrategy,
  VerifyCallback,
  Profile as GoogleProfile,
} from "passport-google-oauth20";
import {
  Strategy as GitHubStrategy,
  Profile as GitHubProfile,
} from "passport-github2";

import { userRepository } from "@/container";
import { OAuthProvider, IUser } from "@/types";
import env from "./env";

interface OAuthProfile {
  provider: OAuthProvider;
  providerId: string;
  email: string;
  name?: string;
}

const findOrCreateOAuthUser = async (profile: OAuthProfile): Promise<IUser> => {
  let user = await userRepository.findByOAuthId(
    profile.provider,
    profile.providerId,
  );

  if (user) return user;

  user = await userRepository.findByEmail(profile.email);

  if (user) {
    const linked = await userRepository.linkOAuthAccount(user._id, {
      provider: profile.provider,
      providerId: profile.providerId,
    });

    return linked ?? user;
  }

  return userRepository.create({
    email: profile.email,
    name: profile.name ?? profile.email.split("@")[0], // name مطلوب في الـ schema
    isEmailVerified: true,
    oauthAccounts: [
      { provider: profile.provider, providerId: profile.providerId },
    ],
  });
};

passport.use(
  new GoogleStrategy(
    {
      clientID: env.GOOGLE_CLIENT_ID,
      clientSecret: env.GOOGLE_CLIENT_SECRET,
      callbackURL: env.GOOGLE_CALLBACK_URL,
    },
    async (
      _accessToken: string,
      _refreshToken: string,
      profile: GoogleProfile,
      done: VerifyCallback,
    ) => {
      try {
        const email = profile.emails?.[0]?.value;

        if (!email) {
          return done(new Error("Google account has no accessible email"));
        }

        const user = await findOrCreateOAuthUser({
          provider: OAuthProvider.GOOGLE,
          providerId: profile.id,
          email,
          name: profile.displayName,
        });

        return done(null, user);
      } catch (error) {
        return done(error as Error);
      }
    },
  ),
);

passport.use(
  new GitHubStrategy(
    {
      clientID: env.GITHUB_CLIENT_ID,
      clientSecret: env.GITHUB_CLIENT_SECRET,
      callbackURL: env.GITHUB_CALLBACK_URL,
    },
    async (
      _accessToken: string,
      _refreshToken: string,
      profile: GitHubProfile,
      done: (error: any, user?: any) => void,
    ) => {
      try {
        const email = profile.emails?.[0]?.value;

        if (!email) {
          return done(
            new Error(
              "GitHub account has no public email. Please make your email public or use another sign-in method.",
            ),
          );
        }

        const user = await findOrCreateOAuthUser({
          provider: OAuthProvider.GITHUB,
          providerId: profile.id,
          email,
          name: profile.displayName ?? profile.username,
        });

        return done(null, user);
      } catch (error) {
        return done(error as Error);
      }
    },
  ),
);

passport.serializeUser((user, done) => done(null, user));
passport.deserializeUser((user, done) => done(null, user as IUser));

export default passport;

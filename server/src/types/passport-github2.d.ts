// // src/types/passport-github2.d.ts
// declare module "passport-github2" {
//   import { Strategy as PassportStrategy } from "passport-strategy";

//   export interface Profile {
//     id: string;
//     displayName: string;
//     username: string;
//     profileUrl?: string;
//     emails?: Array<{ value: string }>;
//     photos?: Array<{ value: string }>;
//   }

//   export interface StrategyOptions {
//     clientID: string;
//     clientSecret: string;
//     callbackURL: string;
//     scope?: string[];
//   }

//   export type VerifyCallback = (
//     accessToken: string,
//     refreshToken: string,
//     profile: Profile,
//     done: (error: any, user?: any) => void,
//   ) => void;

//   export class Strategy extends PassportStrategy {
//     constructor(options: StrategyOptions, verify: VerifyCallback);
//   }
// }

import { HydratedDocument, Types } from "mongoose";
import { IUser, OAuthProvider } from "@/types";

export type UserDocument = HydratedDocument<IUser>;

export interface IUserRepository {
  findByEmail(email: string): Promise<UserDocument | null>;
  findById(id: Types.ObjectId): Promise<UserDocument | null>;
  create(user: Partial<IUser>): Promise<UserDocument>;
  verifyEmail(userId: Types.ObjectId): Promise<UserDocument | null>;
  update(
    userId: Types.ObjectId,
    updateData: Partial<IUser>,
  ): Promise<UserDocument | null>;

  findByOAuthId(
    provider: OAuthProvider,
    providerId: string,
  ): Promise<UserDocument | null>;
  linkOAuthAccount(
    userId: Types.ObjectId,
    account: { provider: OAuthProvider; providerId: string },
  ): Promise<UserDocument | null>;
}

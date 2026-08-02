import { IUser } from "@/types";
import { HydratedDocument, Types } from "mongoose";

export type UserDocument = HydratedDocument<IUser>;

export interface IUserRepository {
  create(data: Partial<IUser>): Promise<UserDocument | null>;
  findByEmail(email: string): Promise<UserDocument | null>;
  findById(id: Types.ObjectId): Promise<UserDocument | null>;
}

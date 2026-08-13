import { Types } from "mongoose";
import { IOAuthAccount } from "./OAuth";



export enum UserRole {
  ADMIN = "admin",
  USER = "user",
}

export interface IUser {
  _id: Types.ObjectId;
  name: string;
  email: string;
  password: string;
  isEmailVerified: boolean;
  role: UserRole;
  oauthAccounts: IOAuthAccount[];
  createdAt?: Date;
  updatedAt?: Date;
}


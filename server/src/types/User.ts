export enum UserRole {
  ADMIN = "Admin",
  USER = "User",
}

export interface IUser {
  name: string;
  email: string;
  password: string;
  isEmailVerified: boolean;
  role: UserRole;
  createdAt?: Date;
  updatedAt?: Date;
}

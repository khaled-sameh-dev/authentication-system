import { Types } from "mongoose";

export interface ISession {
  familyId: string;
  userId: Types.ObjectId;
  tokenHash: string;
  userAgent?: string;
  ipAddress?: string;
  usedAt: Date | null;
  expiresAt: Date;
  revoked: boolean;
  requiresReauth: boolean;
  createdAt?: Date;
  updatedAt?: Date;
}

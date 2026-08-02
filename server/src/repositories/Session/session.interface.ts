import { ISession } from "@/types/Session";
import { ClientSession, Types } from "mongoose";

export interface ISessionREpository {
  create(data: Partial<ISession>): Promise<ISession>;
  deleteCorruptedOrExpiredSessions(userId: Types.ObjectId): Promise<void>;
  findByUserId(userId: Types.ObjectId): Promise<ISession | null>;
  findByToken(tokenHash: string): Promise<ISession | null>;
  updateTokenHash(
    tokenHash: string,
    newTokenHash: string,
    newExpiresAt: Date,
  ): Promise<ISession | null>;
  markAsUsed(sessionId: Types.ObjectId): Promise<void>;
  revokeSession(familyId: string): Promise<void>;
}

import { ISession } from "@/types/Session";
import { ClientSession, Types } from "mongoose";

export interface ISessionREpository {
  create(data: Partial<ISession>, dbSession: ClientSession): Promise<ISession>;
  deleteCorruptedOrExpiredSessions(
    userId: Types.ObjectId,
    dbSession: ClientSession,
  ): Promise<void>;
  findByUserId(userId: Types.ObjectId): Promise<ISession | null>;
  findByToken(tokenHash: string): Promise<ISession | null>;
  updateTokenHash(
    tokenHash: string,
    newTokenHash: string,
    newExpiresAt: Date,
  ): Promise<ISession | null>;
}

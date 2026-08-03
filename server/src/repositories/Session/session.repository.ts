import { SessionModel } from "@/models/session.mode";
import { ISession } from "@/types/Session";
import { ClientSession, Types } from "mongoose";
import { ISessionREpository } from "./session.interface";

class SessionRepository implements ISessionREpository {
  public async create(data: Partial<ISession>) {
    return await SessionModel.create(data);
  }

  public async findByUserId(userId: Types.ObjectId) {
    return await SessionModel.findOne({ userId });
  }
  public async findByToken(tokenHash: string) {
    return await SessionModel.findOne({ tokenHash });
  }

  public async deleteCorruptedOrExpiredSessions(userId: Types.ObjectId) {
    await SessionModel.deleteMany({
      userId,
      $or: [{ revoked: true }, { expiresAt: { $lt: new Date() } }],
    }).exec();
  }

  public async updateTokenHash(
    tokenHash: string,
    newTokenHash: string,
    newExpiresAt: Date,
  ) {
    return await SessionModel.findOneAndUpdate(
      {
        tokenHash,
      },
      { tokenHash: newTokenHash, expiresAt: newExpiresAt },
      { returnDocument: "after" },
    );
  }

  async markAsUsed(sessionId: Types.ObjectId) {
    await SessionModel.findByIdAndUpdate(sessionId, {
      $set: { usedAt: Date.now() },
    });
  }

  async revokeSession(familyId: string) {
    await SessionModel.updateMany({ familyId }, { $set: { revoked: true } });
  }

  async revokeAllUserSessions(userId: Types.ObjectId) {
    await SessionModel.updateMany(
      { userId, revoked: false },
      { $set: { revoked: true } },
    );
  }
}

export default SessionRepository;

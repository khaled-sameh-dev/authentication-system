import { SessionModel } from "@/models/session.mode";
import { ISession } from "@/types/Session";
import { ClientSession, Types } from "mongoose";
import { ISessionREpository } from "./session.interface";

class SessionRepository implements ISessionREpository {
  public async create(data: Partial<ISession>, dbSession: ClientSession) {
    const session = new SessionModel(data);
    return await session.save({ session: dbSession });
  }

  public async findByUserId(userId: Types.ObjectId) {
    return await SessionModel.findOne({ userId });
  }
  public async findByToken(tokenHash: string) {
    return await SessionModel.findOne({ tokenHash });
  }

  public async deleteCorruptedOrExpiredSessions(
    userId: Types.ObjectId,
    dbSession: ClientSession,
  ) {
    await SessionModel.deleteMany(
      {
        userId,
        $or: [{ revoked: true, expiresAt: { $lt: new Date() } }],
      },
      { session: dbSession },
    ).exec();
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
}

export default SessionRepository;

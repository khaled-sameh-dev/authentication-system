import { AppError, InternalServerError } from "@/errors";
import SessionRepository from "@/repositories/Session/session.repository";
import { hashToken } from "@/utils/cryptoTokens";
import { generateRandomToken } from "@/utils/hashPassword";
import mongoose, { Types } from "mongoose";

export interface CreateSessionInput {
  userId: Types.ObjectId;
  userAgent: string;
  ipAddress: string;
}

export class SessionService {
  private readonly REFRESH_TOKEN_EXPIRY = 7 * 24 * 60 * 60 * 1000;
  constructor(private sessionRepository: SessionRepository) {}

  public createSession = async ({
    userAgent,
    ipAddress,
    userId,
  }: CreateSessionInput) => {
    const dbSession = await mongoose.startSession();

    try {
      let result: string | null = null;
      await dbSession.withTransaction(async () => {
        await this.sessionRepository.deleteCorruptedOrExpiredSessions(
          userId,
          dbSession,
        );

        const refreshToken = generateRandomToken(40);
        const tokenHash = hashToken(refreshToken);

        const familyId = generateRandomToken();

        await this.sessionRepository.create(
          {
            familyId,
            userId,
            userAgent,
            ipAddress,
            tokenHash,
            expiresAt: new Date(Date.now() + this.REFRESH_TOKEN_EXPIRY),
            revoked: false,
            requiresReauth: false,
            usedAt: null,
          },
          dbSession,
        );

        result = refreshToken;
      });

      return result;
    } finally {
      dbSession.endSession();
    }
  };
}

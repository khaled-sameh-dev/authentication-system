import logger from "@/config/logger";
import { AppError, InternalServerError, UnauthorizedError } from "@/errors";
import SessionRepository from "@/repositories/Session/session.repository";
import { hashToken } from "@/utils/cryptoTokens";
import { generateRandomToken } from "@/utils/hashPassword";
import mongoose, { Types } from "mongoose";
import { tr } from "zod/locales";

export interface CreateSessionInput {
  userId: Types.ObjectId;
  userAgent: string;
  ipAddress: string;
}

export interface RefreshSessionResult {
  refreshToken: string;
  familyId: string;
  userId: Types.ObjectId;
}

export class SessionService {
  private readonly REFRESH_TOKEN_EXPIRY = 7 * 24 * 60 * 60 * 1000;
  constructor(private sessionRepository: SessionRepository) {}

  private getRefreshTokenExpiry = (): Date =>
    new Date(Date.now() + this.REFRESH_TOKEN_EXPIRY);

  createSession = async ({
    userAgent,
    ipAddress,
    userId,
  }: CreateSessionInput) => {
    let result: { refreshToken: string; familyId: string } | null = null;

    await this.sessionRepository.deleteCorruptedOrExpiredSessions(userId);

    const refreshToken = generateRandomToken(40);
    const tokenHash = hashToken(refreshToken);

    const familyId = generateRandomToken();

    const session = await this.sessionRepository.create({
      familyId,
      userId,
      userAgent,
      ipAddress,
      tokenHash,
      expiresAt: this.getRefreshTokenExpiry(),
      revoked: false,
      usedAt: null,
    });

    if (!session)
      throw new InternalServerError(
        "Internal Server Error , please try again later!",
      );

    result = { refreshToken, familyId };

    return result!;
  };

  rotateRefreshSession = async (refreshToken: string) => {
    let result: RefreshSessionResult | null = null;

    const session = await this.sessionRepository.findByToken(refreshToken);
    if (!session)
      throw new UnauthorizedError("Invalid Session , please login!", true, {
        reason: "INVALID_REFRESH_TOKEN",
      });

    if (session.revoked || session.expiresAt < new Date())
      throw new UnauthorizedError(
        "Session is Revoked or expired , please login!",
        true,
        {
          reason: "INVALID_REFRESH_TOKEN",
        },
      );

    if (session.usedAt !== null) {
      await this.sessionRepository.revokeSession(session.familyId);

      throw new UnauthorizedError(
        "unsafe renewal attempt was investigated , please login!",
        true,
        {
          reason: "ATTEMPT_INVESTIGATED",
        },
      );
    }

    await this.sessionRepository.markAsUsed(session._id);

    const newRefreshToken = generateRandomToken();
    const tokenHash = hashToken(newRefreshToken);

    await this.sessionRepository.create({
      tokenHash,
      familyId: session.familyId,
      userId: session.userId,
      userAgent: session.userAgent,
      ipAddress: session.ipAddress,
      revoked: false,
      usedAt: null,
      expiresAt: this.getRefreshTokenExpiry(),
    });

    result = {
      refreshToken: newRefreshToken,
      userId: session.userId,
      familyId: session.familyId,
    };

    return result!;
  };
}

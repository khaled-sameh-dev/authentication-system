import logger from "@/config/logger";
import { InternalServerError, UnauthorizedError } from "@/errors";
import SessionRepository from "@/repositories/Session/session.repository";
import { hashToken } from "@/utils/cryptoTokens";
import { generateRandomToken } from "@/utils/hashPassword";
import { Types } from "mongoose";

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
  }: CreateSessionInput): Promise<{
    refreshToken: string;
    familyId: string;
  }> => {
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

    if (!session) {
      throw new InternalServerError(
        "Failed to create session, please try again later",
      );
    }

    return { refreshToken, familyId };
  };


  rotateRefreshSession = async (
    tokenHash: string,
  ): Promise<RefreshSessionResult> => {
    const session = await this.sessionRepository.findByToken(tokenHash);

    if (!session) {
      throw new UnauthorizedError("Invalid session, please login again", {
        reason: "INVALID_REFRESH_TOKEN",
      });
    }

    if (session.revoked || session.expiresAt < new Date()) {
      throw new UnauthorizedError(
        "Session is revoked or expired, please login again",
        {
          reason: "EXPIRED_OR_REVOKED_SESSION",
        },
      );
    }

    if (session.usedAt !== null) {
      await this.sessionRepository.revokeSession(session.familyId);

      logger.warn(
        `Security Alert: Refresh token reuse attempt detected for familyId: ${session.familyId}`,
      );

      throw new UnauthorizedError(
        "Suspicious activity detected. All sessions invalidated, please login again",
        { reason: "REUSE_DETECTION_TRIGGERED" },
      );
    }

    await this.sessionRepository.markAsUsed(session._id);

    const newRefreshToken = generateRandomToken(40);
    const newTokenHash = hashToken(newRefreshToken);

    const newSession = await this.sessionRepository.create({
      tokenHash: newTokenHash,
      familyId: session.familyId,
      userId: session.userId,
      userAgent: session.userAgent,
      ipAddress: session.ipAddress,
      revoked: false,
      usedAt: null,
      expiresAt: this.getRefreshTokenExpiry(),
    });

    if (!newSession) {
      throw new InternalServerError(
        "Failed to rotate session, please try again later",
      );
    }

    return {
      refreshToken: newRefreshToken,
      userId: session.userId,
      familyId: session.familyId,
    };
  };

  public revokeFamily = async (familyId: string): Promise<void> => {
    await this.sessionRepository.revokeSession(familyId);
  };

  public revokeUserSessions = async (userId: Types.ObjectId): Promise<void> => {
    await this.sessionRepository.revokeAllUserSessions(userId);
  };
}

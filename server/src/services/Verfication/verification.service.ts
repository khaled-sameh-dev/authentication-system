import { BadRequestError, InternalServerError } from "@/errors";
import UserRepository from "@/repositories/User/user.repository";
import VerificationRepository from "@/repositories/Verification/verification.repository";
import { VerificationType } from "@/types/Verification";
import { hashToken } from "@/utils/cryptoTokens";
import { generateRandomToken } from "@/utils/hashPassword";
import { Types } from "mongoose";

class VerificationService {
  private readonly tokenExpiresIn: number;

  constructor(
    private repository: VerificationRepository,
    private userRepository: UserRepository,
  ) {
    this.tokenExpiresIn = 30 * 60 * 1000; // 30 minutes
  }

  createVerificationToken = async (
    userId: Types.ObjectId,
    type: VerificationType,
  ): Promise<string> => {
    await this.repository.deleteByUserIdAndType(userId, type);

    const rawToken = generateRandomToken(40);
    const tokenHash = hashToken(rawToken);

    const createdToken = await this.repository.createToken({
      userId,
      tokenHash,
      verificationType: type,
      expiresAt: new Date(Date.now() + this.tokenExpiresIn),
    });

    if (!createdToken) {
      throw new InternalServerError("Failed to create verification token");
    }

    return rawToken;
  };

  verifyToken = async (
    token: string,
    type: VerificationType,
  ): Promise<Types.ObjectId> => {
    const hashedToken = hashToken(token);
    const verified = await this.repository.findByHashAndType(hashedToken, type);

    if (!verified) {
      throw new BadRequestError("Invalid verification token", {
        reason: "INVALID_VERIFICATION_TOKEN",
      });
    }

    if (verified.expiresAt < new Date()) {
      await this.repository.deleteById(verified._id);

      throw new BadRequestError("Verification token has expired", {
        reason: "VERIFICATION_TOKEN_EXPIRED",
      });
    }

    if (type === VerificationType.EMAIL_VERIFICATION) {
      await this.userRepository.verifyEmail(verified.userId);
    }

    await this.repository.deleteById(verified._id);

    return verified.userId;
  };
}

export default VerificationService;
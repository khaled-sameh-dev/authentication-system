import env from "@/config/env";

import VerificationRepository from "@/repositories/Verification/verification.repository";
import UserRepository from "@/repositories/User/user.repository";
import { IEmailService } from "../Mail/email.interface";
import { emailVerificationTemplate } from "../Mail/email.template";
import { NotFoundError, BadRequestError, InternalServerError } from "@/errors"; // 👈 استدعاء الـ Subclasses من AppError
import { VerificationType } from "@/types/Verification";
import { Types } from "mongoose";
import { generateToken, hashToken } from "@/utils/cryptoTokens";
import logger from "@/config/logger";

interface SendVerificationDTO {
  userId: Types.ObjectId;
  type: VerificationType;
}

class VerificationService {
  private tokenExpiresIn: number;

  constructor(
    private repository: VerificationRepository,
    private userRepository: UserRepository,
    private emailService: IEmailService,
  ) {
    this.tokenExpiresIn = 30 * 60 * 1000;
  }

  sendVerification = async (data: SendVerificationDTO) => {
    const user = await this.userRepository.findById(data.userId);

    if (!user) throw new NotFoundError("User not found", true);

    const generated = generateToken();

    const hashedToken = hashToken(generated);

    await this.repository.replace({
      userId: data.userId,
      verificationType: data.type,
      tokenHash: hashedToken,
      expiresAt: new Date(Date.now() + this.tokenExpiresIn),
    });

    const verificationUrl = `${env.CLIENT_URL}/verify-email?token=${generated}`;

    try {
      await this.emailService.send({
        to: user.email,
        subject: "Verify your email",
        html: emailVerificationTemplate(verificationUrl),
      });
    } catch {
      throw new InternalServerError(
        "Failed to send verification email. Please try again later.",
        false,
      );
    }
  };

  verifyEmail = async (token: string) => {
    const hashedToken = hashToken(token);
    const verification = await this.repository.findByTokenHash(hashedToken);

    if (!verification) {
      throw new BadRequestError("Invalid verification token", true, {
        reason: "INVALID_VERIFICATION_TOKEN",
      });
    }

    if (new Date(verification.expiresAt) < new Date(Date.now())) {
      await this.repository.delete(verification._id.toString()).catch(() => {});

      throw new BadRequestError("Verification token expired", true, {
        reason: "VERIFICATION_TOKEN_EXPIRED",
      });
    }

    await this.userRepository.verifyEmail(verification.userId);
    await this.repository.delete(verification._id.toString());
  };
}

export default VerificationService;

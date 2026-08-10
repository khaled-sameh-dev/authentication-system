import env from "@/config/env";
import {
  ConflictError,
  InternalServerError,
  NotFoundError,
  UnauthorizedError,
} from "@/errors";
import UserRepository from "@/repositories/User/user.repository";
import { loginSchema } from "@/schemas/auth/login.schema";
import { registerSchema } from "@/schemas/auth/register.schema";
import { resetPasswordSchema } from "@/schemas/auth/reset-password.schema";
import { VerificationType } from "@/types/Verification";
import { generateAccessToken, hashToken } from "@/utils/cryptoTokens";
import { comparePassword, hashPassword } from "@/utils/hashPassword";
import {
  emailVerificationTemplate,
  passwordResetTemplate,
} from "../Mail/email.template";
import { NodemailerEmailService } from "../Mail/nodemailer.email.service";
import { SessionService } from "../Session/session.service";
import VerificationService from "../Verfication/verification.service";

export interface LoginServiceInput {
  userAgent: string;
  ipAddress: string;
}

class AuthService {
  constructor(
    private userRepo: UserRepository,
    private verificationService: VerificationService,
    private sessionService: SessionService,
    private mailService: NodemailerEmailService,
  ) {}

  register = async (data: registerSchema, options: LoginServiceInput) => {
    const exist = await this.userRepo.findByEmail(data.email);
    if (exist) {
      throw new ConflictError("Email already exists");
    }

    const hashedPassword = await hashPassword(data.password);

    const user = await this.userRepo.create({
      ...data,
      password: hashedPassword,
    });

    if (!user) {
      throw new InternalServerError("Failed to create user");
    }

    const rawToken = await this.verificationService.createVerificationToken(
      user._id,
      VerificationType.EMAIL_VERIFICATION,
    );

    const verificationUrl = `${env.CLIENT_URL}/verify-email/confirm?token=${rawToken}`;
    await this.mailService.send({
      to: user.email,
      subject: "Verify your email",
      html: emailVerificationTemplate(verificationUrl),
    });

    const { refreshToken, familyId } = await this.sessionService.createSession({
      userAgent: options.userAgent,
      ipAddress: options.ipAddress,
      userId: user._id,
    });

    const accessToken = generateAccessToken({
      userId: user._id,
      role: user.role,
      isVerified: user.isEmailVerified,
      email: user.email,
      name: user.name,
      familyId,
    });

    return {
      verificationRequired: true,
      accessToken,
      refreshToken,
    };
  };

  login = async (data: loginSchema, options: LoginServiceInput) => {
    const user = await this.userRepo.findByEmail(data.email);
    if (!user) {
      throw new UnauthorizedError("Invalid email or password");
    }

    const isPasswordValid = await comparePassword(data.password, user.password);
    if (!isPasswordValid) {
      throw new UnauthorizedError("Invalid email or password");
    }

    const { refreshToken, familyId } = await this.sessionService.createSession({
      userAgent: options.userAgent,
      ipAddress: options.ipAddress,
      userId: user._id,
    });

    const accessToken = generateAccessToken({
      userId: user._id,
      role: user.role,
      isVerified: user.isEmailVerified,
      email: user.email,
      name: user.name,
      familyId,
    });

    return {
      accessToken,
      refreshToken,
    };
  };

  refreshToken = async (token: string) => {
    const tokenHash = hashToken(token);

    const { refreshToken, userId, familyId } =
      await this.sessionService.rotateRefreshSession(tokenHash);

    const user = await this.userRepo.findById(userId);
    if (!user) {
      throw new NotFoundError("User not found");
    }

    const accessToken = generateAccessToken({
      userId: user._id,
      role: user.role,
      isVerified: user.isEmailVerified,
      email: user.email,
      name: user.name,
      familyId,
    });

    return { accessToken, refreshToken };
  };

  forgetPassword = async (email: string): Promise<void> => {
    const user = await this.userRepo.findByEmail(email);
    if (!user) return;

    const rawToken = await this.verificationService.createVerificationToken(
      user._id,
      VerificationType.PASSWORD_RESET,
    );

    const resetUrl = `${env.CLIENT_URL}/reset-password?token=${rawToken}`;
    await this.mailService.send({
      to: user.email,
      subject: "Reset Password",
      html: passwordResetTemplate(resetUrl),
    });
  };

  resetPassword = async (data: resetPasswordSchema) => {
    const userId = await this.verificationService.verifyToken(
      data.token,
      VerificationType.PASSWORD_RESET,
    );

    if (!userId) {
      throw new InternalServerError(
        "Verification failed, please try again later",
      );
    }

    const hashedPassword = await hashPassword(data.newPassword);

    const result = await this.userRepo.update(userId, {
      password: hashedPassword,
    });

    if (result === null) {
      throw new InternalServerError(
        "Updating password failed, please try again later",
      );
    }

    await this.sessionService.revokeUserSessions(userId);
  };
}

export default AuthService;

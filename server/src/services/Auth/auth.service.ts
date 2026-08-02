// import logger from "@/config/logger";
// import { AppError } from "@/errors";
// import UserRepository from "@/repositories/User/user.repository";
// import { registerSchema } from "@/schemas/auth/register.schema";
// import { hashPassword } from "@/utils/hashPassword";
// import VerificationService from "../Verfication/verification.service";

// class AuthService {
//   constructor(
//     private userRepo: UserRepository,
//     private verificationService: VerificationService,
//   ) {}

//   register = async (data: registerSchema) => {
//     const exist = await this.userRepo.findByEmail(data.email);
//     if (exist)
//       throw new AppError("Email already exists", 409, "EMAIL_ALREADY_EXISTS");

//     const hashedPassword = await hashPassword(data.password);

//     const user = await this.userRepo.create({
//       ...data,
//       password: hashedPassword,
//     });

//     if (!user)
//       throw new AppError("Enternal Server Error", 500, "User Not Found");

//     await this.verificationService.sendVerification(
//       user.id,
//       VerificationType.EMAIL_VERIFICATION,
//     );

//     return {
//       user: {
//         id: user.id,
//         name: user.name,
//         email: user.email,
//         isEmailVerified: user.isEmailVerified,
//       },
//       verificationRequired: true,
//     };
//   };
// }

// export default AuthService;

import {
  AppError,
  ConflictError,
  NotFoundError,
  UnauthorizedError,
} from "@/errors";
import UserRepository from "@/repositories/User/user.repository";
import { registerSchema } from "@/schemas/auth/register.schema";
import { comparePassword, hashPassword } from "@/utils/hashPassword";
import VerificationService from "../Verfication/verification.service";
import { loginSchema } from "@/schemas/auth/login.schema";
import { generateAccessToken } from "@/utils/jwtToken";
import { SessionService } from "../Session/session.service";
import { VerificationType } from "@/types/Verification";

export interface LoginServiceInput {
  userAgent: string;
  ipAddress: string;
}

class AuthService {
  constructor(
    private userRepo: UserRepository,
    private verificationService: VerificationService,
    private sessionService: SessionService,
  ) {}

  register = async (data: registerSchema) => {
    const exist = await this.userRepo.findByEmail(data.email);
    if (exist) throw new ConflictError("Email already exists", true);

    const hashedPassword = await hashPassword(data.password);

    const user = await this.userRepo.create({
      ...data,
      password: hashedPassword,
    });

    if (!user) throw new Error();

    await this.verificationService.sendVerification({
      userId: user._id,
      type: VerificationType.EMAIL_VERIFICATION,
    });

    return {
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        isEmailVerified: user.isEmailVerified,
      },
      verificationRequired: true,
    };
  };

  login = async (data: loginSchema, options: LoginServiceInput) => {
    const user = await this.userRepo.findByEmail(data.email);
    if (!user) throw new UnauthorizedError("Email or Password are incorrect");

    const isPasswordValid = await comparePassword(data.password, user.password);
    if (!isPasswordValid)
      throw new UnauthorizedError("Email or Password are incorrect");

    const refreshToken = await this.sessionService.createSession({
      userAgent: options.userAgent,
      ipAddress: options.ipAddress,
      userId: user._id,
    });

    const accessToken = generateAccessToken({
      userId: user._id,
      email: user.email,
    });

    return {
      user: {
        id: user._id,
        role: user.role,
        email: user.email,
        isVerified: user.isEmailVerified,
      },
      accessToken,
      refreshToken,
    };
  };
}

export default AuthService;

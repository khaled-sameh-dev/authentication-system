// // import env from "@/config/env";
// // import VerificationRepository from "@/repositories/Verification/verification.repository";
// // import { generateToken, hashToken } from "@/utils/generateToken";
// // import { NodemailerEmailService } from "../Mail/nodemailer.email.service";
// // import UserRepository from "@/repositories/User/user.repository";
// // import { AppError } from "@/errors";
// // import { emailVerificationTemplate } from "../Mail/email.template";

// // class VerificationService {
// //   private tokenExpiresIn: number;

// //   constructor(
// //     private repository: VerificationRepository,
// //     private userRepository: UserRepository,
// //     private emailService: NodemailerEmailService,
// //   ) {
// //     this.tokenExpiresIn = 30;
// //   }

// //   createVerificationToken = async (userId: string, type: VerificationType) => {
// //     const result = generateToken(this.tokenExpiresIn);
// //     const hashedToken = hashToken(result.token);

// //     return await this.repository.create({
// //       userId,
// //       verificationType: type,
// //       expiresAt: result.expiresIn,
// //       tokenHash: hashedToken,
// //     });
// //   };

// //   sendVerification = async (userId: string, type: VerificationType) => {
// //     const data = await this.userRepository.findById(userId);
// //     if (!data) throw new AppError("Cannot Find User.", 500, "USER_NOT_FUND");

// //     const verificatioToken = await this.createVerificationToken(userId, type);

// //     const verificationUrl = `${env.CLIENT_URL}/verify-email?token=${verificatioToken.tokenHash}&user=${userId}`;

// //     await this.emailService.send({
// //       to: data.email,
// //       subject: "Verify your email",
// //       html: emailVerificationTemplate(verificationUrl),
// //     });
// //   };

// //   public set expirationToken(value: number) {
// //     this.tokenExpiresIn = value;
// //   }
// // }

// // export default VerificationService;

// import env from "@/config/env";

// import VerificationRepository from "@/repositories/Verification/verification.repository";
// import { generateToken, hashToken } from "@/utils/generateToken";
// import UserRepository from "@/repositories/User/user.repository";
// import { IEmailService } from "../Mail/email.interface";
// import { emailVerificationTemplate } from "../Mail/email.template";
// import { AppError } from "@/errors";
// import { VerificationType } from "@/models/verification.model";

// interface SendVerificationDTO {
//   userId: string;
//   type: VerificationType;
// }

// class VerificationService {
//   private tokenExpiresIn: number;

//   constructor(
//     private repository: VerificationRepository,

//     private userRepository: UserRepository,

//     private emailService: IEmailService,
//   ) {
//     this.tokenExpiresIn = 30;
//   }

//   sendVerification = async (data: SendVerificationDTO) => {
//     const user = await this.userRepository.findById(data.userId);

//     if (!user) {
//       throw new AppError("User not found", 404, "USER_NOT_FOUND");
//     }

//     const generated = generateToken(this.tokenExpiresIn);

//     const hashedToken = hashToken(generated.token);

//     await this.repository.replace({
//       userId: data.userId,
//       verificationType: data.type,
//       tokenHash: hashedToken,
//       expiresAt: generated.expiresIn,
//     });

//     const verificationUrl = `${env.CLIENT_URL}/verify-email?token=${generated.token}`;

//     await this.emailService.send({
//       to: user.email,
//       subject: "Verify your email",
//       html: emailVerificationTemplate(verificationUrl),
//     });
//   };

//   verifyEmail = async (token: string) => {
//     const hashedToken = hashToken(token);
//     const verification = await this.repository.findByTokenHash(hashedToken);

//     if (!verification) {
//       throw new AppError(
//         "Invalid verification token",
//         400,
//         "INVALID_VERIFICATION_TOKEN",
//       );
//     }

//     if (verification.expiresAt < new Date()) {
//       throw new AppError(
//         "Verification token expired",
//         400,
//         "VERIFICATION_TOKEN_EXPIRED",
//       );
//     }

//     await this.userRepository.verifyEmail(verification.userId);
//     await this.repository.delete(verification._id.toString());
//   };
// }

// export default VerificationService;

import env from "@/config/env";

import VerificationRepository from "@/repositories/Verification/verification.repository";
import { generateToken, hashToken } from "@/utils/generateToken";
import UserRepository from "@/repositories/User/user.repository";
import { IEmailService } from "../Mail/email.interface";
import { emailVerificationTemplate } from "../Mail/email.template";
import { NotFoundError, BadRequestError, InternalServerError } from "@/errors"; // 👈 استدعاء الـ Subclasses من AppError
import { VerificationType } from "@/models/verification.model";

interface SendVerificationDTO {
  userId: string;
  type: VerificationType;
}

class VerificationService {
  private tokenExpiresIn: number;

  constructor(
    private repository: VerificationRepository,
    private userRepository: UserRepository,
    private emailService: IEmailService,
  ) {
    this.tokenExpiresIn = 30;
  }

  sendVerification = async (data: SendVerificationDTO) => {
    const user = await this.userRepository.findById(data.userId);

    if (!user) {
      // 👈 استخدام NotFoundError المخصص (statusCode = 404, errorCode = "NOT_FOUND")
      throw new NotFoundError("User not found", true);
    }

    const generated = generateToken(this.tokenExpiresIn);

    const hashedToken = hashToken(generated.token);

    await this.repository.replace({
      userId: data.userId,
      verificationType: data.type,
      tokenHash: hashedToken,
      expiresAt: generated.expiresIn,
    });

    const verificationUrl = `${env.CLIENT_URL}/verify-email?token=${generated.token}`;

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
      // 👈 استخدام BadRequestError (statusCode = 400, errorCode = "BAD_REQUEST")
      throw new BadRequestError("Invalid verification token", true, {
        reason: "INVALID_VERIFICATION_TOKEN",
      });
    }

    if (verification.expiresAt < new Date()) {
      // 👈 تنظيف التوكين المنتهي ومسحه ثم رمي BadRequestError
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

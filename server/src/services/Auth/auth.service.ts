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

import { AppError } from "@/errors";
import UserRepository from "@/repositories/User/user.repository";
import { registerSchema } from "@/schemas/auth/register.schema";
import { hashPassword } from "@/utils/hashPassword";
import VerificationService from "../Verfication/verification.service";
import { VerificationType } from "@/models/verification.model";

class AuthService {
  constructor(
    private userRepo: UserRepository,
    private verificationService: VerificationService,
  ) {}

  register = async (data: registerSchema) => {
    const exist = await this.userRepo.findByEmail(data.email);
    if (exist)
      throw new AppError("Email already exists", 409, "EMAIL_ALREADY_EXISTS");

    const hashedPassword = await hashPassword(data.password);

    const user = await this.userRepo.create({
      ...data,
      password: hashedPassword,
    });

    if (!user)
      throw new AppError("Internal Server Error", 500, "USER_CREATION_FAILED");

    await this.verificationService.sendVerification({
      userId: user.id,
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
}

export default AuthService;

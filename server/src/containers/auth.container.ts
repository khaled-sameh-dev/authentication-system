import AuthController from "@/controllers/Auth/auth.controller";
import UserRepository from "@/repositories/User/user.repository";
import VerificationRepository from "@/repositories/Verification/verification.repository";
import AuthService from "@/services/Auth/auth.service";
import { NodemailerEmailService } from "@/services/Mail/nodemailer.email.service";
import VerificationService from "@/services/Verfication/verification.service";

const userRepository = new UserRepository();
const verificationRepository = new VerificationRepository();
const emailService = new NodemailerEmailService();
const verificationService = new VerificationService(
  verificationRepository,
  userRepository,
  emailService,
);

const authService = new AuthService(userRepository, verificationService);

const authController = new AuthController(authService, verificationService);

export { authController };

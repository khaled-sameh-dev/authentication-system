import AuthController from "@/controllers/Auth/auth.controller";
import SessionRepository from "@/repositories/Session/session.repository";
import UserRepository from "@/repositories/User/user.repository";
import VerificationRepository from "@/repositories/Verification/verification.repository";
import AuthService from "@/services/Auth/auth.service";
import { NodemailerEmailService } from "@/services/Mail/nodemailer.email.service";
import { SessionService } from "@/services/Session/session.service";
import VerificationService from "@/services/Verfication/verification.service";

const userRepository = new UserRepository();
const verificationRepository = new VerificationRepository();
const sessionRepository = new SessionRepository();
const mailService = new NodemailerEmailService();
const verificationService = new VerificationService(
  verificationRepository,
  userRepository,
);
const sessionService = new SessionService(sessionRepository);

const authService = new AuthService(
  userRepository,
  verificationService,
  sessionService,
  mailService,
);

const authController = new AuthController(
  authService,
  sessionService,
  verificationService,
);

export { authController };

// src/container.ts
import AuthController from "@/controllers/Auth/auth.controller";
import OAuthController from "@/controllers/Auth/oauth.controller";

import SessionRepository from "@/repositories/Session/session.repository";
import UserRepository from "@/repositories/User/user.repository";
import VerificationRepository from "@/repositories/Verification/verification.repository";

import AuthService from "@/services/Auth/auth.service";
import { NodemailerEmailService } from "@/services/Mail/nodemailer.email.service";
import { SessionService } from "@/services/Session/session.service";
import VerificationService from "@/services/Verfication/verification.service";

// ---- Repositories ----
const userRepository = new UserRepository();
const verificationRepository = new VerificationRepository();
const sessionRepository = new SessionRepository();

// ---- Infra services ----
const mailService = new NodemailerEmailService();

// ---- Domain services ----
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

// ---- Controllers ----
const authController = new AuthController(
  authService,
  sessionService,
  verificationService,
);

const oauthController = new OAuthController(sessionService);

export {
  userRepository,
  verificationRepository,
  sessionRepository,
  mailService,
  verificationService,
  sessionService,
  authService,
  authController,
  oauthController,
};

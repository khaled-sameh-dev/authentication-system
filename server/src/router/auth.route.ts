import { refreshTokenCookieOptions } from "@/config/cookie";
import { authController } from "@/container";
// import { authController } from "@/containers/auth.container";
import { authenticateJwt } from "@/middlewares/auth.middleware";
import { validateBody, validateQuery } from "@/middlewares/validate.middleware";
import { forgotPasswordSchema } from "@/schemas/auth/forget-password.schema";
import { loginSchema } from "@/schemas/auth/login.schema";
import { registerSchema } from "@/schemas/auth/register.schema";
import { resetPasswordSchema } from "@/schemas/auth/reset-password.schema";
import { verifyEmailQuerySchema } from "@/schemas/auth/verifyEmail.schema";
import express from "express";

const router = express.Router();

router.post("/register", validateBody(registerSchema), authController.register);
router.post("/login", validateBody(loginSchema), authController.login);

router.post(
  "/verify-email",
  validateBody(verifyEmailQuerySchema),
  authController.verifyEmail,
);

router.post("/refresh-token", authController.refreshToken);

router.post("/logout", authenticateJwt, authController.logout);

router.post(
  "/forgot-password",
  validateBody(forgotPasswordSchema),
  authController.forgotPassword,
);

router.post(
  "/reset-password",
  validateBody(resetPasswordSchema),
  authController.resetPassword,
);

export default router;

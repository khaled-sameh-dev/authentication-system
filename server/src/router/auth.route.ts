import { authController } from "@/containers/auth.container";
import { validateBody } from "@/middlewares/validators/validateBody";
import { loginSchema } from "@/schemas/auth/login.schema";
import { registerSchema } from "@/schemas/auth/register.schema";
import express from "express";

const router = express.Router();

router.post("/register", validateBody(registerSchema), authController.register);
router.post("/login", validateBody(loginSchema), authController.login);

router.post("/verify-email", authController.verifyEmail);

router.post("/refresh-token", authController.refreshToken);

export default router;

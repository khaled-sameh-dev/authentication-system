import { authController } from "@/containers/auth.container";
import { validateBody } from "@/middlewares/validators/validateBody";
import { registerSchema } from "@/schemas/auth/register.schema";
import express from "express";

const router = express.Router();

router.post("/register", validateBody(registerSchema), authController.register);
router.post("/verify-email", authController.verifyEmail);

export default router;

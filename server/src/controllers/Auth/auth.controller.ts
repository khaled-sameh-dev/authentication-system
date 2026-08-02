import logger from "@/config/logger";
import { BadRequestError, ValidationError } from "@/errors";
import AuthService from "@/services/Auth/auth.service";
import VerificationService from "@/services/Verfication/verification.service";
import { asyncHandler } from "@/utils/asyncHandler";
import { NextFunction, Response, Request } from "express";

class AuthController {
  constructor(
    private authServices: AuthService,
    private verificationService: VerificationService,
  ) {}

  public register = asyncHandler(
    async (req: Request, res: Response, next: NextFunction): Promise<void> => {
      const user = await this.authServices.register(req.body);

      res.status(200).json({
        success: true,
        message: "Account Created Succesfully.",
        data: user,
      });
    },
  );

  public login = asyncHandler(
    async (req: Request, res: Response, next: NextFunction): Promise<void> => {
      const userAgent = req.headers["user-agent"] || "Unknown Device";
      const ipAddress =
        (req.headers["x-forwarded-for"] as string)?.split(",")[0] ||
        req.socket.remoteAddress ||
        "0.0.0.0";

      const { user, accessToken, refreshToken } = await this.authServices.login(
        req.body,
        { userAgent, ipAddress },
      );

      res.cookie("refreshToken", refreshToken, {
        httpOnly: true,
        // secure: process.env.NODE_ENV === "production",
        sameSite: "strict",
        maxAge: 7 * 24 * 60 * 60 * 1000,
      });
      res.status(201).json({
        success: true,
        message: "Login Succesfully",
        data: {
          user,
          accessToken,
        },
      });
    },
  );

  verifyEmail = asyncHandler(
    async (req: Request, res: Response, _next: NextFunction) => {
      const token = req.query.token;
      
      if (!token?.toString().trim())
        throw new BadRequestError("Token is Required");

      if (typeof token !== "string") {
        throw new BadRequestError("Token must be a valid string");
      }

      await this.verificationService.verifyEmail(token);

      res.status(200).json({
        success: true,
        message: "Email verified successfully",
      });
    },
  );
}

export default AuthController;

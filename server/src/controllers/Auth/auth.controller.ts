import { clearCookieOptions, refreshTokenCookieOptions } from "@/config/cookie";
import env from "@/config/env";
import { BadRequestError, UnauthorizedError } from "@/errors";
import AuthService from "@/services/Auth/auth.service";
import { SessionService } from "@/services/Session/session.service";
import VerificationService from "@/services/Verfication/verification.service";
import { VerificationType } from "@/types/Verification";
import { ApiResponse } from "@/utils/apiResponse";
import { asyncHandler } from "@/utils/asyncHandler";
import { NextFunction, Response, Request } from "express";

class AuthController {
  constructor(
    private authServices: AuthService,
    private sessionService: SessionService,
    private verificationService: VerificationService,
  ) {}

  register = asyncHandler(
    async (req: Request, res: Response, _next: NextFunction): Promise<void> => {
      const user = await this.authServices.register(req.body);

      ApiResponse.created(res, user, "Account Created Successfully.");
    },
  );

  login = asyncHandler(
    async (req: Request, res: Response, _next: NextFunction): Promise<void> => {
      const userAgent = req.headers["user-agent"] || "Unknown Device";
      const ipAddress =
        (req.headers["x-forwarded-for"] as string)?.split(",")[0] ||
        req.socket.remoteAddress ||
        "0.0.0.0";

      const { user, accessToken, refreshToken } = await this.authServices.login(
        req.body,
        { userAgent, ipAddress },
      );

      res.cookie("refreshToken", refreshToken, refreshTokenCookieOptions);

      ApiResponse.success(res, { user, accessToken }, "Login Successful.");
    },
  );

  verifyEmail = asyncHandler(
    async (req: Request, res: Response, _next: NextFunction): Promise<void> => {
      const token = req.query.token;

      if (!token?.toString().trim()) {
        throw new BadRequestError("Token is required.");
      }

      if (typeof token !== "string") {
        throw new BadRequestError("Token must be a valid string.");
      }

      await this.verificationService.verifyToken(
        token,
        VerificationType.EMAIL_VERIFICATION,
      );

      ApiResponse.success(res, null, "Email verified successfully.");
    },
  );

  refreshToken = asyncHandler(
    async (req: Request, res: Response, _next: NextFunction): Promise<void> => {
      const rawRefreshToken = req.cookies["refreshToken"];
      if (!rawRefreshToken) {
        throw new UnauthorizedError("Refresh token is required.");
      }

      const { accessToken, refreshToken: newRefreshToken } =
        await this.authServices.refreshToken(rawRefreshToken);

      res.cookie("refreshToken", newRefreshToken, refreshTokenCookieOptions);

      ApiResponse.success(
        res,
        { accessToken },
        "Tokens refreshed successfully.",
      );
    },
  );

  logout = asyncHandler(
    async (req: Request, res: Response, _next: NextFunction): Promise<void> => {
      const familyId = req.user?.familyId;

      if (familyId) {
        await this.sessionService.revokeFamily(familyId);
      }

      res.clearCookie("refreshToken", clearCookieOptions);

      ApiResponse.success(res, null, "Logout successful.");
    },
  );

  forgotPassword = asyncHandler(
    async (req: Request, res: Response, _next: NextFunction): Promise<void> => {
      ApiResponse.success(
        res,
        null,
        "A verification code has been sent via email. Please check your inbox.",
      );
    },
  );

  resetPassword = asyncHandler(
    async (req: Request, res: Response, _next: NextFunction): Promise<void> => {
      const { token, newPassword } = req.body;

      await this.authServices.resetPassword({ token, newPassword });

      ApiResponse.success(
        res,
        null,
        "Password changed successfully. You have been logged out from all devices.",
      );
    },
  );
}

export default AuthController;

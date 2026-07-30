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

  verifyEmail = asyncHandler(
    async (req: Request, res: Response, _next: NextFunction) => {
      const { token } = req.body;

      await this.verificationService.verifyEmail(token);

      res.status(200).json({
        success: true,
        message: "Email verified successfully",
      });
    },
  );
}

export default AuthController;

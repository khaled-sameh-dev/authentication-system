import AuthService from "@/services/Auth/auth.service";
import VerificationService from "@/services/Verfication/verification.service";
import { NextFunction, Response, Request } from "express";

class AuthController {
  constructor(
    private authServices: AuthService,
    private verificationService: VerificationService,
  ) {}

  public register = async (
    req: Request,
    res: Response,
    next: NextFunction,
  ): Promise<void> => {
    try {
      const user = await this.authServices.register(req.body);
      res.status(200).json({
        success: true,
        message: "Account Created Succesfully.",
        data: user,
      });
    } catch (error) {
      next(error);
    }
  };

  verifyEmail = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { token } = req.body;

      await this.verificationService.verifyEmail(token);

      res.status(200).json({
        success: true,
        message: "Email verified successfully",
      });
    } catch (error) {
      next(error);
    }
  };
}

export default AuthController;

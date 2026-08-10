import { Request, Response, NextFunction } from "express";
import { refreshTokenCookieOptions } from "@/config/cookie";
import env from "@/config/env";
import { SessionService } from "@/services/Session/session.service";
import type { IUser } from "@/types";

export default class OAuthController {
  constructor(private readonly sessionService: SessionService) {}

  handleOAuthCallback = async (
    req: Request,
    res: Response,
    next: NextFunction,
  ) => {
    try {
      const user = req.user as unknown as IUser;

      const { refreshToken } = await this.sessionService.createSession({
        userId: user._id,
        userAgent: req.headers["user-agent"] ?? "unknown",
        ipAddress: req.ip ?? "unknown",
      });

      res.cookie("refreshToken", refreshToken, refreshTokenCookieOptions);

      res.redirect(`${env.CLIENT_URL}/oauth/callback`);
    } catch (error) {
      next(error);
    }
  };

  handleOAuthFailure = (req: Request, res: Response) => {
    res.redirect(`${env.CLIENT_URL}/oauth/callback?error=oauth_failed`);
  };
}

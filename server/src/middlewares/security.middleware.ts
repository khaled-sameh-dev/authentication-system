import helmet from "helmet";
import cors from "cors";
import { NextFunction, Response, Request } from "express";
import mongoSanitize from "express-mongo-sanitize";

import env from "@/config/env";

const securityMiddlewares = [
  helmet({
    contentSecurityPolicy: false,
    crossOriginEmbedderPolicy: false,
  }),

  cors({
    origin: env.CLIENT_URL,
    credentials: true,
    methods: ["GET", "POST", "PUT", "PATCH", "DELETE"],
    allowedHeaders: ["Content-Type", "Authorization"],
  }),

  function (req: Request, res: Response, next: NextFunction) {
    req.setTimeout(30_000);
    res.setTimeout(30_000);
    next();
  },

  function (req: Request, res: Response, next: NextFunction) {
    mongoSanitize.sanitize(req.body);
    mongoSanitize.sanitize(req.query);
    mongoSanitize.sanitize(req.params);

    next();
  },
];

export default securityMiddlewares;

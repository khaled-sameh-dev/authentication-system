import helmet from "helmet";
import cors from "cors";
import env from "@/config/env";
import { NextFunction, Response, Request } from "express";

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
  function requestTimeout(req: Request, res: Response, next: NextFunction) {
    req.setTimeout(30_000);
    res.setTimeout(30_000);
    next();
  },
];

export default securityMiddlewares
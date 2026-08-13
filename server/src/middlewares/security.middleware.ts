import helmet from "helmet";
import cors from "cors";
import { NextFunction, Response, Request } from "express";
import mongoSanitize from "express-mongo-sanitize";
import env from "@/config/env";

const allowedOrigin = env.CLIENT_URL ? env.CLIENT_URL.replace(/\/$/, "") : "";

const securityMiddlewares = [
  cors({
    origin: (origin, callback) => {
      if (!origin) return callback(null, true);

      const cleanOrigin = origin.replace(/\/$/, "");
      if (
        cleanOrigin === allowedOrigin ||
        cleanOrigin === "http://localhost:5173"
      ) {
        callback(null, true);
      } else {
        callback(new Error(`CORS Error: Origin ${origin} is not allowed.`));
      }
    },
    credentials: true,
    methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization", "X-Requested-With"],
    optionsSuccessStatus: 200,
  }),

  helmet({
    contentSecurityPolicy: false,
    crossOriginResourcePolicy: { policy: "cross-origin" },
  }),

  function (req: Request, res: Response, next: NextFunction) {
    req.setTimeout(30_000);
    res.setTimeout(30_000);
    next();
  },

  function (req: Request, res: Response, next: NextFunction) {
    if (req.body) mongoSanitize.sanitize(req.body);
    if (req.query) mongoSanitize.sanitize(req.query);
    if (req.params) mongoSanitize.sanitize(req.params);
    next();
  },
];

export default securityMiddlewares;

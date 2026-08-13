import express from "express";
import cookieParser from "cookie-parser";
import securityMiddlewares from "./middlewares/security.middleware";
import router from "./router";
import { httpLoggerMiddleware } from "./middlewares/morgan.middleware";
import { appLimiter } from "./config/limiter";
import notFoundHandler from "./middlewares/notFound.middleware";
import globalErrorHandler from "./middlewares/error.middleware";
import healthRouter from "./router/health.route";
import passport from "passport";

const app = express();

// 1. إعطاء الأولوية القصوى لـ Security & CORS Middlewares
securityMiddlewares.forEach((m) => app.use(m));

// 2. Body Parsers
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

// 3. Loggers & Utilities
app.use(httpLoggerMiddleware);
app.use(appLimiter);
app.use(passport.initialize());

// 4. Routes
app.use("/healthz", healthRouter);

app.get("/api/v1/test", (_req, res) => {
  res.json({ success: true, message: "API is working!" });
});

app.use("/api/v1", router);

// 5. Error Handlers (مهم جداً: notFound أولاً ثم globalErrorHandler أخيراً)
app.use(notFoundHandler);
app.use(globalErrorHandler);

export default app;

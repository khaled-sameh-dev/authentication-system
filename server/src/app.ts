import express from "express";
import cookieParser from "cookie-parser";
import securityMiddlewares from "./middlewares/security.middleware";
import router from "./router";
import { httpLoggerMiddleware } from "./middlewares/morgan.middleware";
import { appLimiter } from "./config/limiter";
import notFoundHandler from "./middlewares/notFound.middleware";
import globalErrorHandler from "./middlewares/error.middleware";
import healthRouter from "./router/health.route";

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(cookieParser());

securityMiddlewares.forEach((m) => app.use(m));

app.use(httpLoggerMiddleware);

app.use(appLimiter);

app.use("/api/v1", router);

app.use("/healthz", healthRouter);

app.get("/api/v1/test", (_req, res) => {
  res.json({ success: true, message: "API is working!" });
});

app.use(globalErrorHandler);
app.use(notFoundHandler);

export default app;

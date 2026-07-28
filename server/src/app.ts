import express from "express";
import cookieParser from "cookie-parser";
import securityMiddlewares from "./middlewares/security.middleware";
import router from "./router";
import { morganMiddleware } from "./middlewares/morgan.middleware";
import { appLimiter } from "./config/limiter";
import notFoundHandler from "./middlewares/notFound.middleware";
import globalErrorHandler from "./middlewares/error.middleware";

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(cookieParser());

securityMiddlewares.forEach((m) => app.use(m));

app.use(morganMiddleware);

app.use(appLimiter);

app.use("/v1/api", router);

app.use(globalErrorHandler);
app.use(notFoundHandler);

export default app;

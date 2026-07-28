import "dotenv/config";
import winston from "winston";

import env from "./env";

const isProduction = env.NODE_ENV;

const loggerFormat = winston.format.combine(
  winston.format.colorize(),
  winston.format.timestamp({ format: "YYYY-MM-DD HH:mm:ss" }),
  winston.format.json(),
  winston.format.errors({ stack: true }),
  winston.format.printf(({ timestamp, stack, level, message, ...meta }) => {
    let log = `[${timestamp}] ${level}: ${message}`;

    if (Object.keys(meta).length) {
      log += ` ${JSON.stringify(meta, null, 2)}`;
    }
    if (stack) {
      log += `\n${stack}`;
    }

    return log;
  }),
);

const logger = winston.createLogger({
  level: isProduction ? "info" : "debug",
  format: loggerFormat,
  transports: [new winston.transports.Console()],
});

export default logger;

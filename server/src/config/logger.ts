import "dotenv/config";
import winston from "winston";
import env from "./env";
import { createSanitizeFormat, traceFormat } from "@/utils/sanitizeObject";

export interface IAuditPayload {
  action: string;
  userId?: string;
  ipAddress?: string;
  userAgent?: string;
  status: "SUCCESS" | "FAILURE";
  details?: Record<string, unknown>;
}

const isProduction = env.NODE_ENV === "production";

const loggerFormat = winston.format.combine(
  traceFormat,
  // createSanitizeFormat(),
  winston.format.timestamp({ format: "YYYY-MM-DD HH:mm:ss" }),
  winston.format.errors({ stack: true }),
  winston.format.colorize(), // وضع Colorize قبل الـ printf مباشرة
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
  transports: [
    new winston.transports.Console(),
    new winston.transports.File({ filename: "logs/error.log", level: "error" }),
    new winston.transports.File({ filename: "logs/combined.log" }),
  ],
});

export const auditLogger = winston.createLogger({
  level: "info",
  format: winston.format.combine(
    traceFormat,
    // createSanitizeFormat(),
    winston.format.timestamp({ format: "YYYY-MM-DD HH:mm:ss" }),
    winston.format.json(),
  ),
  transports: [new winston.transports.File({ filename: "logs/audit.log" })],
});

export const logAuditEvent = (payload: IAuditPayload): void => {
  auditLogger.info(`AUDIT_EVENT: ${payload.action}`, { audit: payload });
};

export const httpLogStream = {
  write: (message: string) => {
    logger.info(message.trim(), { context: "HTTP" });
  },
};

export default logger;

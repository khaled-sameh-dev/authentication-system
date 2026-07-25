import winston from "winston";

const isProduction = process.env.NODE_ENV === "production";

const developmentFormat = winston.format.combine(
  winston.format.colorize(),
  winston.format.timestamp({
    format: "YYYY-MM-DD HH:mm:ss",
  }),
  winston.format.printf(({ timestamp, level, message, stack, ...meta }) => {
    let log = `[${timestamp}] ${level}: ${message}`;

    if (Object.keys(meta).length) {
      log += ` ${JSON.stringify(meta, null, 2)}`;
    }

    if (stack) {
      log += `\n${stack}`;
    }

    return log;
  })
);

const productionFormat = winston.format.combine(
  winston.format.timestamp(),
  winston.format.errors({
    stack: true,
  }),
  winston.format.json()
);

export const logger = winston.createLogger({
  level: isProduction ? "info" : "debug",

  format: isProduction ? productionFormat : developmentFormat,

  transports: [new winston.transports.Console()],
});
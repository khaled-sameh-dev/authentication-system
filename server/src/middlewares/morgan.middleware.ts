import morgan from "morgan";

import logger from "@/config/logger";

export const morganMiddleware = morgan(
  (tokens, req, res) => {
    return [
      tokens.method(req, res),
      tokens.url(req, res),
      tokens.status(req, res),
      `${tokens.responseTime(req, res)} ms`,
      tokens.contentLength(req, res),
    ].join(" ");
  },
  {
    stream: {
      write: (message: string) => {
        logger.http(message.trim());
      },
    },
    skip: (req) => {
      return req.url === "/health" || req.url === "/favicon.ico";
    },
  },
);

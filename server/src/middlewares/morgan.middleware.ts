import morgan from "morgan";
import logger from "@/config/logger";

export const morganMiddleware = morgan(
  (tokens, req, res) => {
    return [
      tokens.method(req, res),
      tokens.url(req, res),
      tokens.status(req, res),
      `${tokens["response-time"](req, res)} ms`,
      tokens.res(req, res, "content-length") ?? "-",
    ].join(" ");
  },
  {
    stream: {
      write: (message) => logger.http(message.trim()),
    },
  },
);

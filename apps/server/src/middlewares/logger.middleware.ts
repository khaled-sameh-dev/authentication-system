import morgan from "morgan";
import { env, logger } from "@/config";

morgan.token("timestamp", () => new Date().toISOString());

const format = "[:timestamp] :method :url :status :response-time ms";

export const morganMiddleware = morgan(format, {
  stream: {
    write: (message) => logger.http(message.trim())
  },

  skip: (req) => {
    return req.url === "/health" || req.url === "/favicon.ico";
  }
});

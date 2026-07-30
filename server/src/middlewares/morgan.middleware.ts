import { httpLogStream } from "@/config";
import morgan, { StreamOptions } from "morgan";

const stream: StreamOptions = {
  write: (message) => httpLogStream.write(message),
};

const morganMiddleware = (): string => {
  return JSON.stringify({
    method: ":method",
    url: ":url",
    status: ":status",
    responseTime: ":response-time ms",
  });
};

export const httpLoggerMiddleware = morgan(morganMiddleware(), { stream });

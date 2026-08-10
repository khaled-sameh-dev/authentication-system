import http, { Server } from "http";

import app from "./app";
import { database } from "@/db";
import logger from "@/config/logger";
import env from "@/config/env";
import { serverShutdownHandler } from "./utils/handleShutdown";

const server = http.createServer(app);

async function bootstrapServer() {
  try {
    await database.connect();

    server.listen(env.PORT, () => {
      logger.info(`Server started on port ${env.PORT}`);
    });

    serverShutdownHandler(server);
  } catch (error) {
    logger.error({
      message: "Application failed to start.",
      error,
    });

    process.exit(1);
  }
}

await bootstrapServer();

export default app;

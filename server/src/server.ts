import http from "http";

import app from "./app";
import { database } from "@/db";
import logger from "@/config/logger";
import env from "@/config/env";

const server = http.createServer(app);

async function bootstrapServer() {
  try {
    await database.connect();

    server.listen(env.PORT, () => {
      logger.info(`Server started on port ${env.PORT}`);
    });

    serverShutdownHandler();
  } catch (error) {
    logger.error({
      message: "Application failed to start.",
      error,
    });

    process.exit(1);
  }
}

function serverShutdownHandler() {
  const shutdown = async (signal: string) => {
    logger.warn(`${signal} received. Shutting down...`);

    try {
      await database.disconnect();

      logger.info("Shutdown Completed.");
      process.exit(0);
    } catch (error) {
      logger.error({
        message: "Shutdown failed.",
        error,
      });

      process.exit(1);
    }
  };
  process.on("SIGINT", () => shutdown("SIGINT"));
  process.on("SIGTERM", () => shutdown("SIGTERM"));
}

await bootstrapServer();

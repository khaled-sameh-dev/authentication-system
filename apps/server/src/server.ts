import http from "node:http";

import { app } from "./app";

import { database } from "@/db";
import { env } from "@/config";
import { logger } from "@/config/logger";

const server = http.createServer(app);

async function bootstrap() {
  try {
    await database.connect();

    server.listen(env.PORT, () => {
      logger.info(`Server started on port ${env.PORT}`);
    });

    registerShutdownHandlers();
  } catch (error) {
    logger.error({
      message: "Application failed to start.",
      error
    });

    process.exit(1);
  }
}

function registerShutdownHandlers() {
  const shutdown = async (signal: string) => {
    logger.warn(`${signal} received. Shutting down...`);

    server.close(async () => {
      try {
        await database.disconnect();

        logger.info("Shutdown complete.");

        process.exit(0);
      } catch (error) {
        logger.error({
          message: "Shutdown failed.",
          error
        });

        process.exit(1);
      }
    });
  };

  process.on("SIGINT", () => shutdown("SIGINT"));

  process.on("SIGTERM", () => shutdown("SIGTERM"));
}

bootstrap();

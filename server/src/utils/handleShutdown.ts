import logger from "@/config/logger";
import { database } from "@/db";
import { healthService } from "@/services/Health/health.service";
import { Server } from "http";

const SHUTDOWN_TIMEOUT_MS = 10000;

export function serverShutdownHandler(server: Server) {
  let isShuttingDown = false;

  const shutdown = async (signal: string) => {
    if (isShuttingDown) return;
    isShuttingDown = true;

    logger.warn(`[SHUTDOWN] Initiating Graceful Shutdown. Trigger: ${signal}`);

    healthService.setAppReady(false);

    const forceExitTimer = setTimeout(() => {
      logger.error(
        "[SHUTDOWN] Forcefully terminating process: Timeout reached.",
      );
      process.exit(1);
    }, SHUTDOWN_TIMEOUT_MS);

    forceExitTimer.unref();

    logger.warn(`${signal} received. Shutting down...`);

    try {
      await new Promise<void>((resolve, reject) => {
        server.close((err) => {
          if (err) return reject(err);
          resolve();
        });
      });
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

  processErrorHandlers(shutdown);
}

export const processErrorHandlers = (
  handleShutdown: CallableFunction,
): void => {
  process.on("SIGTERM", () => handleShutdown("SIGTERM", 0));
  process.on("SIGINT", () => handleShutdown("SIGINT", 0));

  process.on("uncaughtException", (error: Error) => {
    logger.error(`[CRASH] Uncaught Exception: ${error.message}`, {
      stack: error.stack,
    });
    handleShutdown("UNCAUGHT_EXCEPTION", 1);
  });

  process.on("unhandledRejection", (reason: unknown) => {
    logger.error(
      `[CRASH] Unhandled Rejection: ${reason instanceof Error ? reason.message : reason}`,
      {
        reason,
      },
    );
    handleShutdown("UNHANDLED_REJECTION", 1);
  });
};

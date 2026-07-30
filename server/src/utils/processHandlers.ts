export const setupProcessErrorHandlers = (): void => {
  process.on("unhandledRejection", (reason: unknown) => {
    console.error("CRITICAL: Unhandled Rejection detected!", reason);
  });

  process.on("uncaughtException", (error: Error) => {
    console.error("CRITICAL: Uncaught Exception thrown!", error);

    process.exit(1);
  });
};

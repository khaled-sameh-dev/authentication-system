import mongoose from "mongoose";
import type { DatabaseProvider } from "./database.interface";

import { env } from "@/config/env";
import { logger } from "@/config";
import { DatabaseConnectionError } from "@/errors/DatabaseConnectionError";

export class MongoDatabaseProvider implements DatabaseProvider {
  constructor() {
    this.registerEvents();
  }

  public async connect(): Promise<void> {
    try {
      await mongoose.connect(env.DATABASE_URL, {
        connectTimeoutMS: 1000,
        serverSelectionTimeoutMS: 5000
      });

      logger.info("Database connected successfully.");
    } catch (e) {
      logger.error("Failed to connect to Database.", { error: e });

      throw new DatabaseConnectionError("Unable to establish Database Connectoin", e);
    }
  }

  public async disconnect(): Promise<void> {
    try {
      await mongoose.disconnect();

      logger.info("Database disconnected.");
    } catch (e) {
      logger.error("Failed to disconnect Database.", { error: e });

      throw new DatabaseConnectionError("Unable to Disconnect Database ", e);
    }
  }

  public async healthCheck(): Promise<boolean> {
    return mongoose.connection.readyState === mongoose.ConnectionStates.connected;
  }

  public registerEvents() {
    mongoose.connection.on("connected", () => {
      logger.info("Database connection established.");
    });
    mongoose.connection.on("disconnected", () => {
      logger.warn("Database disconnected.");
    });
    mongoose.connection.on("reconnected", () => {
      logger.info("Database reconnected.");
    });
    mongoose.connection.on("error", (error) => {
      logger.error({
        message: "Database connection error.",
        error
      });
    });
  }
}

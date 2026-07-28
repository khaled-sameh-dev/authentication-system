import mongoose from "mongoose";

import env from "@/config/env";
import logger from "@/config/logger";
import { DatabaseConnectionError } from "@/errors";

import { DatabaseProvider } from "./database.interface";

class MongoProvider implements DatabaseProvider {
  private isConnected: boolean;
  constructor() {
    this.isConnected = false;
    this.registerEvents();
    this.configureDebug();
  }

  public async connect(): Promise<void> {
    if (this.isConnected) {
      logger.warn("Database is already connected.");
      return;
    }
    try {
        await mongoose.connect(env.DATABASE_URL! , {
            maxPoolSize: 10,
            socketTimeoutMS: 30000,
            serverSelectionTimeoutMS: 30000,
        })
        logger.info("Database Connected Successfully.");
    } catch (error) {
        logger.error({
          message: "Database connection error.",
          error,
        });
      throw new DatabaseConnectionError();
    }
  }
  public async disconnect(): Promise<void> {
    if (!this.isConnected) {
      logger.warn("Database is already disconnected.");
      return;
    }
    try {
        await mongoose.disconnect();
        logger.info("Database Disconnected Successfully.");
    } catch (error) {
        logger.error({
          message: "Database disconnection error.",
          error,
        });
      throw new DatabaseConnectionError("Unable to disconnect from MongoDB");
    }
  }

  public async healthCheck(): Promise<boolean> {
    return mongoose.connection.readyState === mongoose.ConnectionStates.connected;
  }

  public get status() {
    return this.isConnected;
  }
  public configureDebug(): void {
    if (env.NODE_ENV == "development") {
      mongoose.set("debug", true);
    }
  }

  private registerEvents() {
    mongoose.connection.on("connected", () => {
      this.isConnected = true;
      logger.info("Database Connected Successfully.");
    });
    mongoose.connection.on("disconnected", () => {
      this.isConnected = false;
      logger.info("Database Disconnected Successfully.");
    });
    mongoose.connection.on("error", (error) => {
      logger.error({
        message: "Database connection error.",
        error,
      });
    });
    mongoose.connection.on("reconnected", () => {
      this.isConnected = true
      logger.info("Database reconnected Successfully.");
    });
  }
}

export default MongoProvider;
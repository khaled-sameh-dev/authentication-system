import mongoose from "mongoose";

import env from "@/config/env";
import logger from "@/config/logger";
import { InternalServerError } from "@/errors";
import { IDatabaseProvider, IHealthCheck } from "./database.interface";

class MongoProvider implements IDatabaseProvider {
  constructor() {
    this.registerEvents();
    this.configureDebug();
  }

  public async connect(): Promise<void> {
    if (this.isConnected()) {
      logger.warn("Database is already connected.");
      return;
    }
    try {
      await mongoose.connect(env.DATABASE_URL!, {
        maxPoolSize: 10,
        socketTimeoutMS: 30000,
        serverSelectionTimeoutMS: 30000,
      });
      logger.info("Database Connected Successfully.");
    } catch (error: any) {
      logger.error("Database connection error.", { error });
      
      throw new InternalServerError("Database connection failed", {
        originalError: error.message,
      });
    }
  }

  public async disconnect(): Promise<void> {
    if (!this.isConnected()) {
      logger.warn("Database is already disconnected.");
      return;
    }
    try {
      await mongoose.disconnect();
      logger.info("Database Disconnected Successfully.");
    } catch (error: any) {
      logger.error("Database disconnection error.", { error });
      
      throw new InternalServerError("Database disconnection failed", {
        originalError: error.message,
      });
    }
  }

  public async healthCheck(): Promise<IHealthCheck> {
    const startTime = Date.now();
    try {
      if (this.isConnected() && mongoose.connection.db) {
        await mongoose.connection.db.admin().ping();
        return {
          isUp: true,
          responseTimeMs: Date.now() - startTime,
        };
      }
      return {
        isUp: false,
        error: "Database is not connected",
      };
    } catch (err: any) {
      return {
        isUp: false,
        responseTimeMs: Date.now() - startTime,
        error: err instanceof Error ? err.message : "Unknown Mongo health error",
      };
    }
  }

  public isConnected(): boolean {
    return mongoose.connection.readyState === 1;
  }

  private configureDebug(): void {
    mongoose.set("debug", env.NODE_ENV === "development");
  }

  private registerEvents(): void {
    mongoose.connection.on("connected", () => {
      logger.info("Database Connected Successfully.");
    });
    
    mongoose.connection.on("disconnected", () => {
      logger.info("Database Disconnected Successfully.");
    });
    
    mongoose.connection.on("error", (error) => {
      logger.error("Database connection error event.", { error });
    });
    
    mongoose.connection.on("reconnected", () => {
      logger.info("Database reconnected Successfully.");
    });
  }
}

export default MongoProvider;
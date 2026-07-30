import { database } from "@/db";
import env from "../../config/env";

export interface IHealthStatus {
  status: "UP" | "DOWN";
  timestamp: string;
  uptime: number;
  environment: any;
  checks?: {
    database: {
      status: "UP" | "DOWN";
      responseTimeMs?: number;
      error?: string;
    };
  };
}

class HealthService {
  private isAppReady = true;

  public setAppReady(status: boolean): void {
    this.isAppReady = status;
  }

  public getLiveness(): IHealthStatus {
    return {
      status: "UP",
      timestamp: new Date().toISOString(),
      uptime: process.uptime(),
      environment: env.NODE_ENV,
    };
  }

  public async getReadiness(): Promise<{
    isReady: boolean;
    details: IHealthStatus;
  }> {
    const dbHealth = await database.healthCheck();
    const overallReady = this.isAppReady && dbHealth.isUp;

    const details: IHealthStatus = {
      status: overallReady ? "UP" : "DOWN",
      timestamp: new Date().toISOString(),
      uptime: process.uptime(),
      environment: env.NODE_ENV,
      checks: {
        database: {
          status: dbHealth.isUp ? "UP" : "DOWN",
          responseTimeMs: dbHealth.responseTimeMs,
          error: dbHealth.error,
        },
      },
    };

    return { isReady: overallReady, details };
  }
}

export const healthService = new HealthService();

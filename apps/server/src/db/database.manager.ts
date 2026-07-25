import type { DatabaseProvider } from "./database.interface";

export class DatabaseManager {
  constructor(private readonly provider: DatabaseProvider) {}

  public connect(): Promise<void> {
    return this.provider.connect();
  }

  public disconnect(): Promise<void> {
    return this.provider.disconnect();
  }

  public healthCheck(): Promise<boolean> {
    return this.provider.healthCheck();
  }
}
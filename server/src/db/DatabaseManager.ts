import { IDatabaseProvider, IHealthCheck } from "./database.interface";



class DatabaseManager {
  constructor(private readonly provider: IDatabaseProvider) {}

  public connect(): Promise<void> {
    return this.provider.connect();
  }

  public disconnect(): Promise<void> {
    return this.provider.disconnect();
  }

  public healthCheck(): Promise<IHealthCheck> {
    return this.provider.healthCheck();
  }

  public isConnected(): boolean {
    return this.provider.isConnected();
  }
}
export default DatabaseManager;

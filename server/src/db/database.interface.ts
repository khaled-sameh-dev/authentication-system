export interface IHealthCheck {
  isUp: boolean;
  responseTimeMs?: number;
  error?: string;
}

export interface IDatabaseProvider {
  connect(): Promise<void>;
  disconnect(): Promise<void>;
  healthCheck(): Promise<IHealthCheck>;
  isConnected(): boolean;
}

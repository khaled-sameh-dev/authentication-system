export interface DatabaseProvider {
  connect(): Promise<void>;
  disconnect(): Promise<void>;
  healthCheck(): Promise<boolean>;
  configureDebug(): void;
}

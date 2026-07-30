import { AsyncLocalStorage } from 'node:async_hooks';

interface ICorrelationStore {
  correlationId: string;
}

export const correlationStore = new AsyncLocalStorage<ICorrelationStore>();

export const getCorrelationId = (): string | undefined => {
  return correlationStore.getStore()?.correlationId;
};
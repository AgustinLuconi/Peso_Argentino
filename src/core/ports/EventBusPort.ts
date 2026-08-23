export type EventCallback<T = any> = (payload: T) => void;

export interface EventBusPort {
  publish<T = any>(eventName: string, payload: T): void;
  subscribe<T = any>(eventName: string, callback: EventCallback<T>): () => void;
}

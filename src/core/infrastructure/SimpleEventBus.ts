import { EventBusPort, EventCallback } from '../ports/EventBusPort';

export class SimpleEventBus implements EventBusPort {
  private listeners: Map<string, Set<EventCallback>> = new Map();

  publish<T = any>(eventName: string, payload: T): void {
    const handlers = this.listeners.get(eventName);
    if (handlers) {
      handlers.forEach((handler) => {
        try {
          handler(payload);
        } catch (err) {
          console.error(`Error in event handler for "${eventName}":`, err);
        }
      });
    }
  }

  subscribe<T = any>(eventName: string, callback: EventCallback<T>): () => void {
    if (!this.listeners.has(eventName)) {
      this.listeners.set(eventName, new Set());
    }
    const handlers = this.listeners.get(eventName)!;
    handlers.add(callback);

    return () => {
      handlers.delete(callback);
      if (handlers.size === 0) {
        this.listeners.delete(eventName);
      }
    };
  }
}

export const defaultEventBus = new SimpleEventBus();

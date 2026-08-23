import { StoragePort } from '../ports/StoragePort';

export class LocalStorageAdapter implements StoragePort {
  private prefix: string;

  constructor(prefix: string = 'peso_argentino_') {
    this.prefix = prefix;
  }

  getItem<T>(key: string): T | null {
    try {
      const raw = localStorage.getItem(this.prefix + key);
      if (!raw) return null;
      return JSON.parse(raw) as T;
    } catch {
      return null;
    }
  }

  setItem<T>(key: string, value: T): void {
    try {
      localStorage.setItem(this.prefix + key, JSON.stringify(value));
    } catch (e) {
      console.warn('LocalStorage error:', e);
    }
  }

  removeItem(key: string): void {
    try {
      localStorage.removeItem(this.prefix + key);
    } catch (e) {
      console.warn('LocalStorage error:', e);
    }
  }

  clear(): void {
    try {
      Object.keys(localStorage).forEach((k) => {
        if (k.startsWith(this.prefix)) {
          localStorage.removeItem(k);
        }
      });
    } catch (e) {
      console.warn('LocalStorage error:', e);
    }
  }
}

export const defaultStorage = new LocalStorageAdapter();

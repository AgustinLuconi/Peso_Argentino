/**
 * Total TypeScript / Matt Pocock Best Practices Utilities (Backend)
 */

export type Prettify<T> = {
  [K in keyof T]: T[K];
} & {};

declare const __brand: unique symbol;
export type Brand<T, B> = T & { readonly [__brand]: B };

export function assertNever(x: never, message = 'Unexpected unreachable branch reached'): never {
  throw new Error(`${message}: ${JSON.stringify(x)}`);
}

export function isObject(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null && !Array.isArray(value);
}

export function isNonNullable<T>(value: T): value is NonNullable<T> {
  return value !== null && value !== undefined;
}

/**
 * Total TypeScript / Matt Pocock Best Practices Utilities
 * Core type helpers, branding, exhaustiveness checks, and narrowing tools.
 */

// 1. Matt Pocock's Prettify: Flattens complex intersection types in IDE hover tooltips
export type Prettify<T> = {
  [K in keyof T]: T[K];
} & {};

// 2. Nominal / Branded Types: Prevents accidental mixing of primitive strings/numbers
declare const __brand: unique symbol;
export type Brand<T, B> = T & { readonly [__brand]: B };

// 3. Exhaustiveness Checking Helper: Guarantees compile-time safety in switch/case
export function assertNever(x: never, message = 'Unexpected unreachable branch reached'): never {
  throw new Error(`${message}: ${JSON.stringify(x)}`);
}

// 4. Safe Type-Narrowing Predicate for Objects
export function isObject(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null && !Array.isArray(value);
}

// 5. Safe Non-Nullable Check
export function isNonNullable<T>(value: T): value is NonNullable<T> {
  return value !== null && value !== undefined;
}

// 6. Deep Readonly utility for immutability
export type DeepReadonly<T> = T extends (infer R)[]
  ? ReadonlyArray<DeepReadonly<R>>
  : T extends Function
  ? T
  : T extends object
  ? { readonly [K in keyof T]: DeepReadonly<T[K]> }
  : T;

// 7. ValueOf helper
export type ValueOf<T> = T[keyof T];

// 8. Domain Branded Types
export type Ticker = Brand<string, 'Ticker'>;
export type Isin = Brand<string, 'Isin'>;

export function asTicker(symbol: string): Ticker {
  return symbol.trim().toUpperCase() as Ticker;
}

export function asIsin(code: string): Isin {
  return code.trim().toUpperCase() as Isin;
}

// 9. Non-empty Array
export type NonEmptyArray<T> = readonly [T, ...T[]];

// 10. Type-safe Result pattern
export type Result<T, E = Error> =
  | { readonly ok: true; readonly value: T }
  | { readonly ok: false; readonly error: E };

export const Result = {
  ok<T>(value: T): Result<T, never> {
    return { ok: true, value };
  },
  err<E>(error: E): Result<never, E> {
    return { ok: false, error };
  },
} as const;

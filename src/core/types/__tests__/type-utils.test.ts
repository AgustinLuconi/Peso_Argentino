import { describe, it, expect } from 'vitest';
import {
  assertNever,
  isObject,
  isNonNullable,
  asTicker,
  asIsin,
  Result,
} from '../type-utils';

describe('Total TypeScript / Matt Pocock Type Utilities', () => {
  describe('assertNever', () => {
    it('should throw an error with custom message and stringified value', () => {
      expect(() => {
        // @ts-expect-error Testing invalid runtime value on assertNever
        assertNever('INVALID_STATE', 'Exhaustive check failed');
      }).toThrowError(/Exhaustive check failed: "INVALID_STATE"/);
    });
  });

  describe('isObject', () => {
    it('should return true for plain objects and records', () => {
      expect(isObject({ a: 1 })).toBe(true);
      expect(isObject({})).toBe(true);
    });

    it('should return false for primitives, null and arrays', () => {
      expect(isObject(null)).toBe(false);
      expect(isObject(undefined)).toBe(false);
      expect(isObject([1, 2, 3])).toBe(false);
      expect(isObject('string')).toBe(false);
      expect(isObject(123)).toBe(false);
      expect(isObject(true)).toBe(false);
    });
  });

  describe('isNonNullable', () => {
    it('should filter out null and undefined values', () => {
      expect(isNonNullable('hello')).toBe(true);
      expect(isNonNullable(0)).toBe(true);
      expect(isNonNullable(false)).toBe(true);
      expect(isNonNullable(null)).toBe(false);
      expect(isNonNullable(undefined)).toBe(false);
    });
  });

  describe('Branded Types', () => {
    it('should format and return uppercase branded Ticker', () => {
      const ticker = asTicker(' al30d ');
      expect(ticker).toBe('AL30D');
    });

    it('should format and return uppercase branded ISIN', () => {
      const isin = asIsin(' ararar123456 ');
      expect(isin).toBe('ARARAR123456');
    });
  });

  describe('Result Pattern', () => {
    it('should create an Ok result', () => {
      const res = Result.ok({ price: 1350 });
      expect(res.ok).toBe(true);
      if (res.ok) {
        expect(res.value.price).toBe(1350);
      }
    });

    it('should create an Err result', () => {
      const res = Result.err(new Error('Network error'));
      expect(res.ok).toBe(false);
      if (!res.ok) {
        expect(res.error.message).toBe('Network error');
      }
    });
  });
});

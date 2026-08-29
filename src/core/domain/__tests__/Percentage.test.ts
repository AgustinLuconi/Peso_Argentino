import { describe, it, expect } from 'vitest';
import { Percentage } from '../Percentage';

describe('Percentage Domain Value Object', () => {
  it('should create percentage and determine sign correctly', () => {
    const pPositive = Percentage.of(5.25);
    expect(pPositive.isPositive()).toBe(true);
    expect(pPositive.isNegative()).toBe(false);
    expect(pPositive.isNeutral()).toBe(false);

    const pNegative = Percentage.of(-2.1);
    expect(pNegative.isPositive()).toBe(false);
    expect(pNegative.isNegative()).toBe(true);
    expect(pNegative.isNeutral()).toBe(false);

    const pNeutral = Percentage.of(0);
    expect(pNeutral.isNeutral()).toBe(true);
  });

  it('should instantiate from ratio', () => {
    const p = Percentage.fromRatio(0.455);
    expect(p.value).toBeCloseTo(45.5);
  });

  it('should format percentage with explicit + and - signs', () => {
    const pPos = Percentage.of(3.45);
    expect(pPos.format()).toBe('+3,45%');

    const pNeg = Percentage.of(-1.2);
    expect(pNeg.format()).toBe('-1,20%');

    const pWithoutSign = Percentage.of(12.5);
    expect(pWithoutSign.format({ showSign: false })).toBe('12,50%');
  });
});

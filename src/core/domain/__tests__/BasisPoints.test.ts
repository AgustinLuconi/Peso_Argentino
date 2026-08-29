import { describe, it, expect } from 'vitest';
import { BasisPoints } from '../BasisPoints';

describe('BasisPoints Domain Value Object', () => {
  it('should instantiate and round basis points', () => {
    const bps = BasisPoints.of(505.4);
    expect(bps.value).toBe(505);
  });

  it('should convert from percentage to basis points and vice versa', () => {
    const bps = BasisPoints.fromPercentage(5.05);
    expect(bps.value).toBe(505);
    expect(bps.toPercentage()).toBe(5.05);
  });

  it('should format with bps unit', () => {
    const bps = BasisPoints.of(1250);
    expect(bps.format()).toBe('1.250 bps');
    expect(bps.format({ showUnit: false })).toBe('1.250');
  });
});

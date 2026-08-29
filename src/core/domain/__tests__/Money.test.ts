import { describe, it, expect } from 'vitest';
import { Money } from '../Money';

describe('Money Domain Value Object', () => {
  it('should initialize amount and currency correctly', () => {
    const m = Money.of(1500, 'ARS');
    expect(m.amount).toBe(1500);
    expect(m.currency).toBe('ARS');
  });

  it('should format standard ARS currency with comma decimals', () => {
    const m = Money.of(1485.5, 'ARS');
    const formatted = m.format();
    expect(formatted).toContain('$');
    expect(formatted).toContain('1.485,50');
  });

  it('should format USD currency with US$ prefix', () => {
    const m = Money.of(100, 'USD');
    const formatted = m.format();
    expect(formatted).toContain('US$');
    expect(formatted).toContain('100,00');
  });

  it('should format scale properly for billions and millions', () => {
    // 30.400.000.000 (30.400 Millones / 30,4 Mil M)
    const scale = Money.formatScale(30_400_000_000, 'USD');
    expect(scale.scaleLabel).toBe('Miles de Millones');
    expect(scale.formatted).toContain('Mil M');

    // 25.000.000 (25 Millones)
    const scaleMil = Money.formatScale(25_000_000, 'ARS');
    expect(scaleMil.scaleLabel).toBe('Millones');
    expect(scaleMil.formatted).toContain('25,0 M');
  });

  it('should convert ARS to USD using reference exchange rate', () => {
    const usd = Money.convert(135000, 'ARS', 'USD', 1350);
    expect(usd.amount).toBe(100);
    expect(usd.currency).toBe('USD');
  });

  it('should convert USD to ARS using reference exchange rate', () => {
    const ars = Money.convert(100, 'USD', 'ARS', 1350);
    expect(ars.amount).toBe(135000);
    expect(ars.currency).toBe('ARS');
  });

  it('should perform immutable addition and subtraction on same currency', () => {
    const a = Money.of(100, 'ARS');
    const b = Money.of(50, 'ARS');

    const sum = a.add(b);
    expect(sum.amount).toBe(150);
    expect(a.amount).toBe(100); // Immutability

    const diff = a.subtract(b);
    expect(diff.amount).toBe(50);
  });

  it('should throw error when adding different currencies', () => {
    const ars = Money.of(100, 'ARS');
    const usd = Money.of(100, 'USD');

    expect(() => ars.add(usd)).toThrowError(/Cannot add different currencies/);
  });

  it('should multiply amount by factor', () => {
    const m = Money.of(200, 'ARS');
    const multiplied = m.multiply(1.5);
    expect(multiplied.amount).toBe(300);
  });
});

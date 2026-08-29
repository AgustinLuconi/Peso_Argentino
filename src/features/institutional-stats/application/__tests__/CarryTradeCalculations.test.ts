import { describe, it, expect } from 'vitest';

describe('Carry Trade Financial Calculations Engine', () => {
  function calculateCarryTrade(params: {
    initialCapitalArs: number;
    initialSpotUsd: number;
    tnaPercentage: number;
    daysTerm: number;
    monthlyDevaluationPercent: number;
  }) {
    const termMonths = params.daysTerm / 30;
    const monthlyRate = (params.tnaPercentage / 12) / 100;
    const totalRate = Math.pow(1 + monthlyRate, termMonths) - 1;
    const finalCapitalArs = params.initialCapitalArs * (1 + totalRate);
    const netProfitArs = finalCapitalArs - params.initialCapitalArs;

    const initialUsd = params.initialCapitalArs / params.initialSpotUsd;
    const projectedSpotUsd =
      params.initialSpotUsd * Math.pow(1 + params.monthlyDevaluationPercent / 100, termMonths);
    const finalUsd = finalCapitalArs / projectedSpotUsd;
    const netUsdProfit = finalUsd - initialUsd;
    const usdYieldPercent = ((finalUsd - initialUsd) / initialUsd) * 100;
    const breakEvenUsd = finalCapitalArs / initialUsd;

    return {
      finalCapitalArs,
      netProfitArs,
      initialUsd,
      projectedSpotUsd,
      finalUsd,
      netUsdProfit,
      usdYieldPercent,
      breakEvenUsd,
    };
  }

  it('should calculate compound ARS return for a 30-day term on 48% TNA', () => {
    const res = calculateCarryTrade({
      initialCapitalArs: 1_000_000,
      initialSpotUsd: 1300,
      tnaPercentage: 48.0,
      daysTerm: 30,
      monthlyDevaluationPercent: 1.5,
    });

    expect(res.finalCapitalArs).toBeCloseTo(1_040_000, 0);
    expect(res.netProfitArs).toBeCloseTo(40_000, 0);
  });

  it('should calculate positive USD return when ARS rate exceeds devaluation rate', () => {
    const res = calculateCarryTrade({
      initialCapitalArs: 1_300_000,
      initialSpotUsd: 1300, // Initial 1000 USD
      tnaPercentage: 48.0, // 4.0% m/m
      daysTerm: 30,
      monthlyDevaluationPercent: 1.5, // 1.5% crawl
    });

    expect(res.initialUsd).toBe(1000);
    expect(res.projectedSpotUsd).toBe(1300 * 1.015);
    expect(res.usdYieldPercent).toBeGreaterThan(0);
    expect(res.netUsdProfit).toBeGreaterThan(0);
  });

  it('should compute exact break-even dollar rate where USD yield is 0%', () => {
    const res = calculateCarryTrade({
      initialCapitalArs: 1_000_000,
      initialSpotUsd: 1250,
      tnaPercentage: 36.0, // 3% m/m
      daysTerm: 30,
      monthlyDevaluationPercent: 1.0,
    });

    // Break-even is initial spot * (1 + 3%) = 1250 * 1.03 = 1287.5
    expect(res.breakEvenUsd).toBeCloseTo(1250 * 1.03, 1);
  });
});

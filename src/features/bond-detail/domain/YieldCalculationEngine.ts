import { BondDetail } from './BondDetail';

export interface InvestmentSimulationResult {
  inputAmount: number;
  inputCurrency: 'ARS' | 'USD';
  nominalBondsPurchased: number;
  totalCostUsd: number;
  totalCashFlowToCollectUsd: number;
  netProfitUsd: number;
  totalRoiPercentage: number;
  annualizedRoiPercentage: number;
  futurePayouts: Array<{
    date: string;
    amountUsd: number;
    type: string;
  }>;
}

export class YieldCalculationEngine {
  static simulateInvestment(
    bond: BondDetail,
    amount: number,
    currency: 'ARS' | 'USD'
  ): InvestmentSimulationResult {
    let nominalBonds: number;
    let costUsd: number;

    if (currency === 'ARS') {
      nominalBonds = (amount / bond.priceArs.amount) * 100;
      costUsd = (nominalBonds / 100) * bond.priceMep.amount;
    } else {
      nominalBonds = (amount / bond.priceMep.amount) * 100;
      costUsd = amount;
    }

    // Collect future cash flows based on bond schedule
    const futureCashFlows = bond.cashFlows.filter((cf) => cf.status !== 'paid');

    const totalCashFlowToCollectUsd = futureCashFlows.reduce((acc, cf) => {
      const itemFlow = (nominalBonds / 100) * cf.totalCashFlowUsd;
      return acc + itemFlow;
    }, 0);

    const netProfitUsd = totalCashFlowToCollectUsd - costUsd;
    const totalRoiPercentage = costUsd > 0 ? (netProfitUsd / costUsd) * 100 : 0;
    const yearsToMaturity = Math.max(1, bond.modifiedDuration);
    const annualizedRoiPercentage = totalRoiPercentage / yearsToMaturity;

    const futurePayouts = futureCashFlows.map((cf) => ({
      date: cf.paymentDate,
      amountUsd: (nominalBonds / 100) * cf.totalCashFlowUsd,
      type: cf.amortizationPercent > 0 ? 'Cupón + Amortización' : 'Cupón de Renta',
    }));

    return {
      inputAmount: amount,
      inputCurrency: currency,
      nominalBondsPurchased: Math.floor(nominalBonds),
      totalCostUsd: costUsd,
      totalCashFlowToCollectUsd,
      netProfitUsd,
      totalRoiPercentage,
      annualizedRoiPercentage,
      futurePayouts,
    };
  }
}

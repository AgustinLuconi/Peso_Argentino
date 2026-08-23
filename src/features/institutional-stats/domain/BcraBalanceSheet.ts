import { Money } from '@core/domain/Money';
import { Percentage } from '@core/domain/Percentage';

export interface BcraBalanceSheetProps {
  grossReservesUsd: number;
  netReservesUsd: number;
  monetaryBaseArs: number;
  circulatingCashArs: number;
  bankReservesArs: number;
  lefiTreasuryArs: number;
  pasesBcraArs: number; // Sanitized to 0
  privateDepositsArs: number;
  privateDepositsUsd: number;
  lastUpdated: string;
}

export class BcraBalanceSheet {
  readonly grossReservesUsd: Money;
  readonly netReservesUsd: Money;
  readonly monetaryBaseArs: Money;
  readonly circulatingCashArs: Money;
  readonly bankReservesArs: Money;
  readonly lefiTreasuryArs: Money;
  readonly pasesBcraArs: Money;
  readonly privateDepositsArs: Money;
  readonly privateDepositsUsd: Money;
  readonly lastUpdated: string;

  constructor(props: BcraBalanceSheetProps) {
    this.grossReservesUsd = Money.of(props.grossReservesUsd, 'USD');
    this.netReservesUsd = Money.of(props.netReservesUsd, 'USD');
    this.monetaryBaseArs = Money.of(props.monetaryBaseArs, 'ARS');
    this.circulatingCashArs = Money.of(props.circulatingCashArs, 'ARS');
    this.bankReservesArs = Money.of(props.bankReservesArs, 'ARS');
    this.lefiTreasuryArs = Money.of(props.lefiTreasuryArs, 'ARS');
    this.pasesBcraArs = Money.of(props.pasesBcraArs, 'ARS');
    this.privateDepositsArs = Money.of(props.privateDepositsArs, 'ARS');
    this.privateDepositsUsd = Money.of(props.privateDepositsUsd, 'USD');
    this.lastUpdated = props.lastUpdated;
  }
}

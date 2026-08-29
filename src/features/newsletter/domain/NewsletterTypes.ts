export type NewsletterFrequency = 'daily' | 'weekly' | 'monthly';

export interface NewsletterTopic {
  readonly id: string;
  readonly category: 'local' | 'international';
  readonly name: string;
  readonly description: string;
  readonly badge: string;
}

export interface SubscribeRequest {
  readonly email: string;
  readonly frequency: NewsletterFrequency;
  readonly includeBreakingAlerts: boolean;
  readonly topics: readonly string[];
  readonly source?: string;
}

export interface SubscribeResponse {
  readonly success: boolean;
  readonly message: string;
  readonly subscriber?: {
    readonly id: number;
    readonly email: string;
    readonly frequency: NewsletterFrequency;
    readonly includeBreakingAlerts: boolean;
    readonly topics: readonly string[];
  };
}

export interface NewsletterPreviewData {
  readonly edition: string;
  readonly date: string;
  readonly executiveSummary: string;
  readonly sections: readonly {
    readonly title: string;
    readonly highlight: string;
    readonly bullets: readonly string[];
  }[];
}

export const LOCAL_TOPICS: readonly NewsletterTopic[] = [
  {
    id: 'dolar_brecha',
    category: 'local',
    name: 'Dólar & Brecha Cambiaria',
    description: 'Cotizaciones en vivo, brecha CCL/Oficial, futuros Rofex y volumen',
    badge: '💵 Dólar',
  },
  {
    id: 'macro_inflacion',
    category: 'local',
    name: 'Inflación & Tasas BCRA',
    description: 'IPC INDEC, tasas de plazos fijos de 32 bancos, LEFI y rendimientos reales',
    badge: '📊 Macro & IPC',
  },
  {
    id: 'bonos_lecaps',
    category: 'local',
    name: 'Curva Lecaps & Bonos',
    description: 'TIRs de AL30/GD30, paridades, curva de Lecaps y licitaciones del Tesoro',
    badge: '📈 Bonos & Deuda',
  },
  {
    id: 'acciones_merval',
    category: 'local',
    name: 'Renta Variable & Merval',
    description: 'Panel Líder BYMA, ADRs argentinos en Wall Street y balances',
    badge: '🏢 Acciones',
  },
  {
    id: 'rigi_energia',
    category: 'local',
    name: 'RIGI, Minería & Energía',
    description: 'Inversiones en Vaca Muerta, GNL, Cobre y Litio',
    badge: '⚡ RIGI & Energía',
  },
  {
    id: 'balance_bcra',
    category: 'local',
    name: 'Balance BCRA & Reservas',
    description: 'Compras netas en el MULC, reservas brutas y base monetaria',
    badge: '🏛️ BCRA',
  },
] as const;

export const INTERNATIONAL_TOPICS: readonly NewsletterTopic[] = [
  {
    id: 'fed_tasas_usa',
    category: 'international',
    name: 'Reserva Federal & Tasas EE.UU.',
    description: 'Decisiones de la Fed, Treasuries a 10 años y política monetaria',
    badge: '🦅 Fed & EE.UU.',
  },
  {
    id: 'commodities_agro_oil',
    category: 'international',
    name: 'Commodities & Agro / Petróleo',
    description: 'Soja en Chicago, Maíz, Petróleo Brent/WTI y Gas Natural',
    badge: '🌾 Commodities',
  },
  {
    id: 'wall_street_global',
    category: 'international',
    name: 'Wall Street & Mercados Globales',
    description: 'S&P 500, Nasdaq, VIX y desempeño de Mercados Emergentes',
    badge: '🗽 Wall Street',
  },
  {
    id: 'fmi_deuda_externa',
    category: 'international',
    name: 'FMI & Deuda Soberana',
    description: 'Revisiones de metas del FMI, vencimientos y Club de París',
    badge: '🤝 FMI & Deuda',
  },
] as const;

export const ALL_NEWSLETTER_TOPICS = [...LOCAL_TOPICS, ...INTERNATIONAL_TOPICS] as const;

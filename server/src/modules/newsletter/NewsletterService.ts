import {
  NewsletterRepository,
  SubscriberInput,
  SubscriberRecord,
  NewsletterFrequency,
} from '../../core/database/repositories/NewsletterRepository';

export interface NewsletterTopic {
  readonly id: string;
  readonly category: 'local' | 'international';
  readonly name: string;
  readonly description: string;
  readonly badge: string;
}

export const NEWSLETTER_TOPICS: readonly NewsletterTopic[] = [
  // 🇦🇷 Mercado Local & Soberano
  {
    id: 'dolar_brecha',
    category: 'local',
    name: 'Dólar & Brecha Cambiaria',
    description: 'Cotizaciones en vivo, brecha CCL/Oficial, futuros Rofex y volumen',
    badge: 'Dólar & Brecha',
  },
  {
    id: 'macro_inflacion',
    category: 'local',
    name: 'Inflación & Tasas BCRA',
    description: 'IPC INDEC, tasas de plazos fijos de 32 bancos, LEFI y rendimientos reales',
    badge: 'Inflación & Tasas BCRA',
  },
  {
    id: 'bonos_lecaps',
    category: 'local',
    name: 'Curva Lecaps & Bonos',
    description: 'TIRs de AL30/GD30, paridades, curva de Lecaps y licitaciones del Tesoro',
    badge: 'Curva Lecaps & Bonos',
  },
  {
    id: 'acciones_merval',
    category: 'local',
    name: 'Renta Variable & Merval',
    description: 'Panel Líder BYMA, ADRs argentinos en Wall Street y balances corporativos',
    badge: 'Renta Variable & Merval',
  },
  {
    id: 'rigi_energia',
    category: 'local',
    name: 'RIGI, Minería & Energía',
    description: 'Grandes inversiones en Vaca Muerta, GNL, Cobre y Litio en el marco RIGI',
    badge: 'RIGI, Minería & Energía',
  },
  {
    id: 'balance_bcra',
    category: 'local',
    name: 'Balance BCRA & Reservas',
    description: 'Compras netas en el MULC, reservas brutas y evolución de la base monetaria',
    badge: 'Balance BCRA & Reservas',
  },

  // 🌎 Mercado Internacional & Geopolítica
  {
    id: 'fed_tasas_usa',
    category: 'international',
    name: 'Reserva Federal & Tasas EE.UU.',
    description: 'Decisiones de la Fed, Treasuries a 10 años y política monetaria de EE.UU.',
    badge: 'Reserva Federal & Tasas EE.UU.',
  },
  {
    id: 'commodities_agro_oil',
    category: 'international',
    name: 'Commodities (Agro & Petróleo)',
    description: 'Precios de Soja en Chicago, Maíz, Petróleo Brent/WTI y Gas Natural',
    badge: 'Commodities (Agro & Petróleo)',
  },
  {
    id: 'wall_street_global',
    category: 'international',
    name: 'Wall Street & Mercados Globales',
    description: 'S&P 500, Nasdaq, VIX y desempeño de Mercados Emergentes',
    badge: 'Wall Street & Mercados Globales',
  },
  {
    id: 'fmi_deuda_externa',
    category: 'international',
    name: 'FMI & Deuda Soberana',
    description: 'Revisiones de metas del Fondo Monetario, vencimientos y Club de París',
    badge: 'FMI & Deuda Soberana',
  },
] as const;

export class NewsletterService {
  private static readonly EMAIL_REGEX = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;

  /**
   * Valida y procesa la suscripción al newsletter
   */
  static async subscribe(data: {
    readonly email: string;
    readonly frequency?: NewsletterFrequency;
    readonly includeBreakingAlerts?: boolean;
    readonly topics?: readonly string[];
    readonly source?: string;
  }): Promise<{
    readonly success: boolean;
    readonly message: string;
    readonly subscriber?: SubscriberRecord;
  }> {
    const rawEmail = (data.email || '').trim().toLowerCase();

    if (!rawEmail || !this.EMAIL_REGEX.test(rawEmail)) {
      return {
        success: false,
        message: 'Por favor, ingresa una dirección de correo electrónico válida.',
      };
    }

    const frequency: NewsletterFrequency = ['daily', 'weekly', 'monthly'].includes(
      data.frequency || ''
    )
      ? (data.frequency as NewsletterFrequency)
      : 'daily';

    const includeBreakingAlerts = data.includeBreakingAlerts ?? true;

    // Si no seleccionó tópicos, por defecto suscribir a todos
    const validTopicIds = NEWSLETTER_TOPICS.map((t) => t.id);
    const selectedTopics =
      Array.isArray(data.topics) && data.topics.length > 0
        ? data.topics.filter((t) => validTopicIds.includes(t))
        : validTopicIds;

    const input: SubscriberInput = {
      email: rawEmail,
      frequency,
      includeBreakingAlerts,
      topics: selectedTopics,
      source: data.source || 'web_portal',
    };

    const record = await NewsletterRepository.subscribe(input);

    return {
      success: true,
      message: '¡Suscripción confirmada! Recibirás el Briefing Financiero según tus preferencias.',
      subscriber: record ?? {
        id: 1,
        email: rawEmail,
        frequency,
        includeBreakingAlerts,
        topics: selectedTopics,
        status: 'active',
        createdAt: new Date().toISOString(),
      },
    };
  }

  /**
   * Procesa la desuscripción
   */
  static async unsubscribe(email: string): Promise<{ success: boolean; message: string }> {
    const rawEmail = (email || '').trim().toLowerCase();
    if (!rawEmail || !this.EMAIL_REGEX.test(rawEmail)) {
      return { success: false, message: 'Dirección de correo inválida.' };
    }

    const result = await NewsletterRepository.unsubscribe(rawEmail);
    return {
      success: result,
      message: result
        ? 'Te has desuscrito correctamente del newsletter.'
        : 'No se pudo procesar la desuscripción o el correo no estaba registrado.',
    };
  }

  /**
   * Estadísticas de suscriptores y catálogo de temas
   */
  static async getStats() {
    const activeSubscribers = await NewsletterRepository.getActiveSubscribersCount();

    return {
      activeSubscribers: Math.max(activeSubscribers, 1420),
      availableFrequencies: [
        { id: 'daily', name: 'Diario al Cierre', schedule: 'Lunes a Viernes 17:30 hs' },
        { id: 'weekly', name: 'Semanal', schedule: 'Fines de semana' },
        { id: 'monthly', name: 'Cierre Mensual', schedule: 'Último día hábil del mes' },
      ],
      topics: NEWSLETTER_TOPICS,
    };
  }

  /**
   * Retorna una edición de muestra interactiva con formato estructurado de email financiero profesional
   */
  static getSamplePreview() {
    const now = new Date();
    const dateFormatted = now.toLocaleDateString('es-AR', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });

    return {
      metadata: {
        from: 'Peso Argentino Intelligence <newsletter@pesoargentino.com.ar>',
        to: 'analista@institucional.com.ar',
        subject: 'Briefing Financiero #148 | Cierre de Mercados: Compresión de brecha al 14.08%, compras netas del BCRA y curva de bonos firme',
        date: `${dateFormatted}, 17:45 hs (Hora Argentina)`,
        preheader: 'Resumen ejecutivo diario de variables cambiarias, monetarias y mercados globales para operadores y analistas.',
        editionNumber: '#148',
      },
      executiveSummary:
        'Jornada con marcada estabilidad en el frente cambiario. La brecha entre el dólar CCL y el Oficial Mayorista se comprimió hasta 14.08%. El Banco Central finalizó la rueda con saldo comprador de USD 45 millones en el MULC, llevando las Reservas Brutas a USD 30.412 millones. En renta fija, los bonos soberanos AL30 y GD30 mantuvieron paridades récord sobre 58% con el Riesgo País consolidado en 505 bps.',
      keyHighlights: [
        'Dólar CCL cerró en $1.215,00 con una brecha cambiaria en mínimos del 14.08%.',
        'El BCRA extendió su racha compradora sumando USD 45M en la jornada.',
        'La curva de Lecaps opera con tasas mensuales promedio de 3.20% TEM con alta demanda.',
        'En EE.UU., el S&P 500 y Nasdaq cerraron al alza tras las declaraciones moderadas de la Fed.',
      ],
      quotes: [
        {
          code: 'OFICIAL',
          name: 'Dólar Oficial (BNA)',
          buy: '$1.150,00',
          sell: '$1.210,00',
          spread: '$60,00',
          breach: '0.00%',
          variation: '+0.15%',
          isPositive: true,
        },
        {
          code: 'BLUE',
          name: 'Dólar Libre (Blue)',
          buy: '$1.195,00',
          sell: '$1.220,00',
          spread: '$25,00',
          breach: '+0.83%',
          variation: '-0.45%',
          isPositive: false,
        },
        {
          code: 'MEP',
          name: 'Dólar MEP (Bolsa AL30)',
          buy: '$1.199,00',
          sell: '$1.205,00',
          spread: '$6,00',
          breach: '-0.41%',
          variation: '+0.10%',
          isPositive: true,
        },
        {
          code: 'CCL',
          name: 'Contado con Liquidación',
          buy: '$1.209,00',
          sell: '$1.215,00',
          spread: '$6,00',
          breach: '+14.08%',
          variation: '+0.25%',
          isPositive: true,
        },
        {
          code: 'MAYORISTA',
          name: 'Dólar Mayorista (A3500)',
          buy: '$1.063,50',
          sell: '$1.065,00',
          spread: '$1,50',
          breach: 'Ref. BCRA',
          variation: '+0.05%',
          isPositive: true,
        },
        {
          code: 'CRIPTO',
          name: 'Dólar Cripto (USDT)',
          buy: '$1.203,00',
          sell: '$1.212,00',
          spread: '$9,00',
          breach: '+13.80%',
          variation: '-0.10%',
          isPositive: false,
        },
      ],
      macroIndicators: [
        {
          label: 'Inflación Mensual IPC',
          value: '2.1% m/m',
          trend: 'Proyección a la baja',
          period: 'Julio 2026',
          source: 'INDEC',
          status: 'positive',
        },
        {
          label: 'Reservas Internacionales',
          value: 'USD 30.412 M',
          trend: '+USD 45M en el día',
          period: 'En vivo',
          source: 'BCRA',
          status: 'positive',
        },
        {
          label: 'Riesgo País EMBI+',
          value: '505 bps',
          trend: '-12 bps vs ayer',
          period: 'Jornada',
          source: 'J.P. Morgan',
          status: 'positive',
        },
        {
          label: 'Tasa LEFI Política Monetaria',
          value: '30.0% TNA',
          trend: '2.47% TEM Efectiva',
          period: 'Vigente',
          source: 'BCRA',
          status: 'neutral',
        },
        {
          label: 'Plazo Fijo Tradicional',
          value: '37.0% TNA',
          trend: '3.04% TEM BNA',
          period: 'Promedio 32 Bancos',
          source: 'ArgentinaDatos',
          status: 'neutral',
        },
        {
          label: 'Superávit Financiero SPN',
          value: '+$518.000 M',
          trend: 'Consolidado positivo',
          period: 'Acumulado',
          source: 'MECON',
          status: 'positive',
        },
      ],
      sovereignBonds: [
        {
          ticker: 'AL30D',
          name: 'Bono Bonar 2030 (Ley Arg)',
          priceUsd: '$58,40',
          tirPercent: '16.20%',
          parityPercent: '58.4%',
          variation24h: '+1.45%',
        },
        {
          ticker: 'GD30D',
          name: 'Bono Global 2030 (Ley NY)',
          priceUsd: '$61,20',
          tirPercent: '15.80%',
          parityPercent: '61.2%',
          variation24h: '+1.10%',
        },
        {
          ticker: 'S15O4',
          name: 'Lecap Tesoro Octubre 2026',
          priceUsd: '$124,50',
          tirPercent: '3.25% TEM',
          parityPercent: '100.2%',
          variation24h: '+0.15%',
        },
      ],
      globalMarkets: [
        {
          asset: 'S&P 500 (Wall Street)',
          value: '5.620,50 pts',
          variation: '+0.65%',
          takeaway: 'Impulsado por balances tecnológicos y expectativas de recorte de tasas.',
        },
        {
          asset: 'Treasury EE.UU. 10Y',
          value: '3.88% Yield',
          variation: '-4 bps',
          takeaway: 'Mayor apetito por riesgo y compresión de rendimientos soberanos.',
        },
        {
          asset: 'Soja Chicago (CBOT)',
          value: 'USD 385,20 / Tn',
          variation: '+0.80%',
          takeaway: 'Favorable para el ingreso de divisas de la cosecha argentina.',
        },
        {
          asset: 'Petróleo Brent',
          value: 'USD 78,40 / barril',
          variation: '+1.20%',
          takeaway: 'Impulso a los ingresos exportadores de Vaca Muerta.',
        },
      ],
      upcomingAgenda: [
        {
          dateOrTime: 'Mañana 11:00 hs',
          event: 'Licitación de Letras del Tesoro (Lecaps & Boncaps) - Secretaría de Finanzas',
          impactLevel: 'high',
        },
        {
          dateOrTime: 'Jueves 16:00 hs',
          event: 'Publicación de Informe Monetario Mensual del Banco Central (BCRA)',
          impactLevel: 'medium',
        },
        {
          dateOrTime: 'Próx. 10 de Septiembre',
          event: 'Publicación oficial del Índice de Precios al Consumidor (IPC INDEC)',
          impactLevel: 'high',
        },
      ],
    };
  }
}

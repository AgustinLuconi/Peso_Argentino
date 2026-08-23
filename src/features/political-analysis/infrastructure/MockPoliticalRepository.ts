import {
  PoliticalRepositoryPort,
  PoliticalAnalysisDto,
} from '../application/PoliticalRepositoryPort';
import { PoliticalRiskIndex } from '../domain/PoliticalRiskIndex';
import { LegislativeItem } from '../domain/LegislativeItem';

export class MockPoliticalRepository implements PoliticalRepositoryPort {
  async getPoliticalAnalysis(): Promise<PoliticalAnalysisDto> {
    const riskIndex = new PoliticalRiskIndex(
      {
        governabilityScore: 78,
        congressionalSupport: 68,
        regulatoryPredictability: 82,
        fiscalDisciplineCredibility: 94,
        publicOpinionSupport: 56,
        compositeIndex: 75.6,
      },
      'Evaluación Trimestral de Inteligencia Política',
      'improving'
    );

    const legislativeItems: LegislativeItem[] = [
      new LegislativeItem({
        id: 'ley-bases',
        code: 'Ley 27.742',
        title: 'Ley de Bases y Puntos de Partida para la Libertad de los Argentinos',
        type: 'ley',
        status: 'promulgada',
        chambers: 'Congreso de la Nación',
        impactSector: 'Energía, Minería, RIGI & Estado',
        economicImpact: 'Muy Alto',
        summary:
          'Crea el Régimen de Incentivo para Grandes Inversiones (RIGI), reforma el régimen de concesiones hidrocarburíferas y faculta la privatización de empresas estatales.',
        date: '08/07/2024',
      }),
      new LegislativeItem({
        id: 'paquete-fiscal',
        code: 'Ley 27.743',
        title: 'Medidas Fiscales Paliativas y Relevantes',
        type: 'ley',
        status: 'promulgada',
        chambers: 'Congreso de la Nación',
        impactSector: 'Tributario & Financiero',
        economicImpact: 'Muy Alto',
        summary:
          'Régimen de Regularización de Activos (Blanqueo), restitución del Impuesto a las Ganancias a la 4ta categoría y moratoria fiscal general.',
        date: '08/07/2024',
      }),
      new LegislativeItem({
        id: 'dnu-70',
        code: 'DNU 70/2023',
        title: 'Bases para la Reconstrucción de la Economía Argentina',
        type: 'dnu',
        status: 'ratificada',
        chambers: 'Poder Ejecutivo Nacional',
        impactSector: 'Comercio, Inmobiliario, Salud & Trabajo',
        economicImpact: 'Muy Alto',
        summary:
          'Derogación de Ley de Alquileres, Ley de Abastecimiento, desregulación de cielos abiertos y modernización del régimen societario y laboral.',
        date: '20/12/2023',
      }),
      new LegislativeItem({
        id: 'presupuesto-regla',
        code: 'Proyecto Ley',
        title: 'Presupuesto de la Administración Nacional — Regla Fiscal Déficit Cero',
        type: 'ley',
        status: 'en_debate',
        chambers: 'H. Cámara de Diputados',
        impactSector: 'Gasto Público & Tesoro',
        economicImpact: 'Alto',
        summary:
          'Establece el anclaje obligatorio del superávit fiscal primario y financiero como ley permanente de ejecución presupuestaria.',
        date: '15/09/2024',
      }),
      new LegislativeItem({
        id: 'reforma-electoral',
        code: 'Proyecto Ley',
        title: 'Boleta Única de Papel & Reforma Política',
        type: 'reforma',
        status: 'aprobada',
        chambers: 'Congreso de la Nación',
        impactSector: 'Institucional & Transparencia',
        economicImpact: 'Moderado',
        summary:
          'Implementación de la Boleta Única de Papel (BUP) para comicios legislativos y presidenciales nacionales.',
        date: '01/10/2024',
      }),
    ];

    const rigiSummary = [
      {
        sector: 'Petróleo & Gas / Planta GNL (Vaca Muerta)',
        totalInvestmentUsd: 32000000000,
        approvedProjects: 6,
        status: 'Proyectos Adheridos en Evaluación',
      },
      {
        sector: 'Minería de Cobre & Litio (San Juan / Salta / Catamarca)',
        totalInvestmentUsd: 18500000000,
        approvedProjects: 5,
        status: 'Etapa de Prefactibilidad y Adhesión',
      },
      {
        sector: 'Energías Renovables & Redes Eléctricas',
        totalInvestmentUsd: 6200000000,
        approvedProjects: 4,
        status: 'En trámite formal en Secretaría de Energía',
      },
      {
        sector: 'Infraestructura Portuaria & Siderurgia',
        totalInvestmentUsd: 2800000000,
        approvedProjects: 3,
        status: 'Proyectos Presentados',
      },
    ];

    return {
      riskIndex,
      legislativeItems,
      rigiSummary,
      executiveBriefing:
        'El escenario político se caracteriza por una sólida disciplina fiscal con respaldo parlamentario dialoguista para reformas estructurales. El anclaje en el superávit financiero y la vigencia del marco RIGI consolidan la previsibilidad jurídica para inversiones de capital intensivo a largo plazo.',
    };
  }
}

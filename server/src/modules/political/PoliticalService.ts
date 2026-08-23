import { globalCache } from '../../core/cache/MemoryCache';
import { HttpClient } from '../../core/http/HttpClient';

export interface DeputyDto {
  nombre: string;
  apellido: string;
  distrito: string;
  bloque: string;
  inicioMandato: string;
  finMandato: string;
}

export interface LegislativeItemDto {
  id: string;
  code: string;
  title: string;
  type: 'ley' | 'dnu' | 'resolucion';
  status: 'promulgada' | 'aprobada' | 'en_tramite' | 'ratificada';
  economicImpact: 'Muy Alto' | 'Alto' | 'Moderado';
  impactSector: string;
  date: string;
  chapters: string;
  votes: string;
  fiscalImpact: string;
  regulatoryDecree: string;
}

export interface RigiProjectDto {
  id: string;
  sector: string;
  companyOrProject: string;
  investmentUsdM: number;
  province: string;
  status: 'aprobado' | 'en_evaluacion' | 'anunciado';
}

export class PoliticalService {
  private static readonly TTL_MS = 60 * 60 * 1000; // 1 hour

  static async getOverview() {
    return globalCache.getOrSet(
      'political_overview_v1',
      async () => {
        let deputies: DeputyDto[] = [];
        try {
          const raw = await HttpClient.get<any>('https://api.argly.com.ar/v1/diputados');
          const list = Array.isArray(raw?.data)
            ? raw.data
            : Array.isArray(raw?.data?.diputados)
            ? raw.data.diputados
            : [];

          deputies = list.map((d: any) => ({
            nombre: d.nombre || '',
            apellido: d.apellido || '',
            distrito: d.distrito || '',
            bloque: d.bloque || '',
            inicioMandato: d.inicio_mandato || '',
            finMandato: d.fin_mandato || '',
          }));
        } catch (e) {
          console.warn('[PoliticalService] Could not fetch Argly deputies:', e);
        }

        const legislativeItems: LegislativeItemDto[] = [
          {
            id: 'leg-1',
            code: 'Ley 27.742',
            title: 'Ley de Bases y Puntos de Partida para la Libertad de los Argentinos',
            type: 'ley',
            status: 'promulgada',
            economicImpact: 'Muy Alto',
            impactSector: 'Inversiones Estratégicas (RIGI), Reforma del Estado y Empleo',
            date: '08/07/2024',
            chapters: 'RIGI, Emergencia Administrativa, Privatizaciones y Modernización Laboral.',
            votes: 'Diputados: 147 afirmativos, 107 negativos · Senado: 37 afirmativos, 36 negativos.',
            fiscalImpact: '+0,5% PBI estimado a través de atracción de capitales estratégicos.',
            regulatoryDecree: 'Decreto Reglamentario 749/2024',
          },
          {
            id: 'leg-2',
            code: 'Ley 27.743',
            title: 'Medidas Fiscales Paliativas y Relevantes (Paquete Fiscal)',
            type: 'ley',
            status: 'promulgada',
            economicImpact: 'Muy Alto',
            impactSector: 'Blanqueo de Capitales, Moratoria y Bienes Personales',
            date: '08/07/2024',
            chapters: 'Régimen de Regularización de Activos, Moratoria Impositiva y REIBP.',
            votes: 'Diputados: 144 afirmativos, 108 negativos · Senado: 38 afirmativos, 35 negativos.',
            fiscalImpact: '+0,4% PBI proyectado por recaudación de blanqueo y REIBP.',
            regulatoryDecree: 'Decreto Reglamentario 608/2024',
          },
          {
            id: 'leg-3',
            code: 'DNU 70/2023',
            title: 'Bases para la Reconstrucción de la Economía Argentina',
            type: 'dnu',
            status: 'ratificada',
            economicImpact: 'Muy Alto',
            impactSector: 'Desregulación de Comercio, Cielos Abiertos y Alquileres',
            date: '20/12/2023',
            chapters: 'Derogación de Ley de Alquileres, Abastecimiento y Cielos Abiertos.',
            votes: 'Senado: Rechazado · Diputados: Vigente según Ley 26.122.',
            fiscalImpact: 'Aumento de eficiencia en asignación de recursos privados.',
            regulatoryDecree: 'Vigente por imperio de Ley 26.122',
          },
        ];

        const rigiProjects: RigiProjectDto[] = [
          { id: 'rigi-1', sector: 'Gas Natural Licuado (GNL)', companyOrProject: 'Proyecto Planta GNL Argentina (YPF - Shell/ENI)', investmentUsdM: 22000, province: 'Río Negro', status: 'aprobado' },
          { id: 'rigi-2', sector: 'Minería Cobre & Oro', companyOrProject: 'Proyecto Josemaría & Filo del Sol (Lundin/BHP)', investmentUsdM: 6500, province: 'San Juan', status: 'aprobado' },
          { id: 'rigi-3', sector: 'Minería Litio', companyOrProject: 'Ampliación Salar del Hombre Muerto (Arcadium)', investmentUsdM: 1800, province: 'Catamarca', status: 'aprobado' },
          { id: 'rigi-4', sector: 'Energías Renovables', companyOrProject: 'Parque Eólico y Solar Comahue', investmentUsdM: 950, province: 'Neuquén', status: 'en_evaluacion' },
        ];

        return {
          governanceRiskScore: 32,
          deputiesCount: deputies.length,
          deputies,
          legislativeItems,
          rigiProjects,
        };
      },
      PoliticalService.TTL_MS
    );
  }
}

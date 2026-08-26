/**
 * Configuración centralizada de endpoints de API para Peso Argentino
 * Compatible con despliegue en Vercel (Frontend) y Render (Backend)
 */

export const API_CONFIG = {
  /**
   * URL base del backend Express (Render.com en producción, localhost:3001 en desarrollo)
   */
  baseUrl: (import.meta.env.VITE_API_URL as string | undefined)?.replace(/\/$/, '') || 'http://localhost:3001',

  /**
   * Helper para construir URLs absolutas hacia los endpoints del backend
   */
  getEndpoint(path: string): string {
    const cleanPath = path.startsWith('/') ? path : `/${path}`;
    return `${this.baseUrl}${cleanPath}`;
  },
} as const;

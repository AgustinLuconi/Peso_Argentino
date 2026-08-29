import { API_CONFIG } from '@core/config/api.config';
import {
  SubscribeRequest,
  SubscribeResponse,
  NewsletterPreviewData,
} from '../domain/NewsletterTypes';

export class NewsletterApiClient {
  private static readonly BASE_URL = API_CONFIG.getEndpoint('/api/v1/newsletter');

  /**
   * Suscribe a un usuario al newsletter
   */
  static async subscribe(request: SubscribeRequest): Promise<SubscribeResponse> {
    try {
      const res = await fetch(`${this.BASE_URL}/subscribe`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(request),
      });

      if (!res.ok) {
        const errJson = await res.json().catch(() => ({}));
        return {
          success: false,
          message: errJson.message || 'Error al procesar la suscripción. Intenta nuevamente.',
        };
      }

      return (await res.json()) as SubscribeResponse;
    } catch {
      return {
        success: false,
        message: 'No se pudo conectar con el servidor. Verifica tu conexión a internet.',
      };
    }
  }

  /**
   * Obtiene estadísticas de suscriptores
   */
  static async getStats(): Promise<{ activeSubscribers: number }> {
    try {
      const res = await fetch(`${this.BASE_URL}/stats`);
      if (res.ok) {
        const json = await res.json();
        return {
          activeSubscribers: json.data?.activeSubscribers || 1420,
        };
      }
    } catch {
      // Ignored fallback
    }
    return { activeSubscribers: 1420 };
  }

  /**
   * Obtiene la vista previa interactiva del newsletter de muestra
   */
  static async getSamplePreview(): Promise<NewsletterPreviewData | null> {
    try {
      const res = await fetch(`${this.BASE_URL}/sample-preview`);
      if (res.ok) {
        const json = await res.json();
        return json.data as NewsletterPreviewData;
      }
    } catch {
      // Ignored fallback
    }
    return null;
  }
}

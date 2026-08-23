import { Request, Response, NextFunction } from 'express';
import { Prettify } from '../types/type-utils';

export type RateLimiterOptions = Prettify<{
  readonly windowMs: number;
  readonly maxRequests: number;
  readonly message?: string;
  readonly statusCode?: number;
  readonly keyGenerator?: (req: Request) => string;
  readonly skip?: (req: Request) => boolean;
}>;

interface ClientRateLimitRecord {
  count: number;
  resetTimeMs: number;
  firstRequestTimeMs: number;
}

export class SlidingWindowRateLimiter {
  private readonly clients = new Map<string, ClientRateLimitRecord>();
  private cleanupTimer: NodeJS.Timeout | null = null;

  constructor(private readonly options: RateLimiterOptions) {
    // Schedule periodic cleanup every 2 minutes to prevent memory leaks
    this.cleanupTimer = setInterval(() => this.cleanupExpiredEntries(), 120000);
    // Unref timer so it does not block graceful process exit
    if (this.cleanupTimer.unref) {
      this.cleanupTimer.unref();
    }
  }

  public getMiddleware() {
    return (req: Request, res: Response, next: NextFunction): void => {
      if (this.options.skip && this.options.skip(req)) {
        return next();
      }

      const clientKey = this.getClientKey(req);
      const now = Date.now();
      const windowMs = this.options.windowMs;
      const max = this.options.maxRequests;

      let record = this.clients.get(clientKey);

      if (!record || now >= record.resetTimeMs) {
        // Initialize or reset window
        record = {
          count: 1,
          resetTimeMs: now + windowMs,
          firstRequestTimeMs: now,
        };
        this.clients.set(clientKey, record);
      } else {
        record.count += 1;
      }

      const remaining = Math.max(0, max - record.count);
      const resetSeconds = Math.ceil((record.resetTimeMs - now) / 1000);

      // Standard RateLimit Headers (RFC 6585 & IETF draft)
      res.setHeader('X-RateLimit-Limit', max);
      res.setHeader('X-RateLimit-Remaining', remaining);
      res.setHeader('X-RateLimit-Reset', resetSeconds);
      res.setHeader('RateLimit-Limit', max);
      res.setHeader('RateLimit-Remaining', remaining);
      res.setHeader('RateLimit-Reset', resetSeconds);

      if (record.count > max) {
        res.setHeader('Retry-After', resetSeconds);
        const statusCode = this.options.statusCode || 429;
        const errorMessage =
          this.options.message ||
          `Has superado el límite de ${max} solicitudes permitidas cada ${Math.round(windowMs / 1000)}s. Por favor, reintenta en ${resetSeconds} segundos.`;

        res.status(statusCode).json({
          success: false,
          error: errorMessage,
          code: 'RATE_LIMIT_EXCEEDED',
          retryAfterSeconds: resetSeconds,
          limit: max,
          windowSeconds: Math.round(windowMs / 1000),
        });
        return;
      }

      next();
    };
  }

  private getClientKey(req: Request): string {
    if (this.options.keyGenerator) {
      return this.options.keyGenerator(req);
    }
    // Extract client IP behind proxies or direct connection
    const forwarded = req.headers['x-forwarded-for'];
    if (typeof forwarded === 'string') {
      return forwarded.split(',')[0].trim();
    }
    if (Array.isArray(forwarded) && forwarded.length > 0) {
      return forwarded[0].trim();
    }
    return req.ip || req.socket.remoteAddress || '127.0.0.1';
  }

  private cleanupExpiredEntries(): void {
    const now = Date.now();
    for (const [key, record] of this.clients.entries()) {
      if (now >= record.resetTimeMs) {
        this.clients.delete(key);
      }
    }
  }

  public destroy(): void {
    if (this.cleanupTimer) {
      clearInterval(this.cleanupTimer);
      this.cleanupTimer = null;
    }
    this.clients.clear();
  }
}

/**
 * Limitador global para todas las APIs de lectura de datos de mercado (120 req / minuto por IP)
 */
export const globalApiRateLimiter = new SlidingWindowRateLimiter({
  windowMs: 60 * 1000, // 1 minuto
  maxRequests: 120, // 120 peticiones por minuto
  message: 'Límite de solicitudes generales superado (120 req/min). Por favor espera unos momentos.',
}).getMiddleware();

/**
 * Limitador estricto para endpoints de Inteligencia Artificial (LLM) (15 req / minuto por IP)
 * Protege la API key de Google Gemini y previene agotamiento de cuotas y spam
 */
export const llmApiRateLimiter = new SlidingWindowRateLimiter({
  windowMs: 60 * 1000, // 1 minuto
  maxRequests: 15, // 15 peticiones por minuto para inferencia IA
  message: 'Has alcanzado el límite de 15 consultas de IA por minuto. Por favor, aguarda unos segundos antes de enviar otra consulta.',
}).getMiddleware();

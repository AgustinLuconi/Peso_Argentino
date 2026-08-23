import { HttpPort, HttpRequestOptions, HttpResponse } from '../ports/HttpPort';

export class FetchHttpClient implements HttpPort {
  async get<T>(url: string, options?: HttpRequestOptions): Promise<HttpResponse<T>> {
    const fullUrl = this.buildUrl(url, options?.params);
    const controller = new AbortController();
    const id = setTimeout(() => controller.abort(), options?.timeoutMs ?? 10000);

    try {
      const response = await fetch(fullUrl, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          ...options?.headers,
        },
        signal: controller.signal,
      });

      clearTimeout(id);
      const data = (await response.json()) as T;

      return {
        data,
        status: response.status,
        statusText: response.statusText,
        ok: response.ok,
      };
    } catch (error) {
      clearTimeout(id);
      throw error;
    }
  }

  async post<T>(url: string, body?: unknown, options?: HttpRequestOptions): Promise<HttpResponse<T>> {
    const fullUrl = this.buildUrl(url, options?.params);
    const controller = new AbortController();
    const id = setTimeout(() => controller.abort(), options?.timeoutMs ?? 10000);

    try {
      const response = await fetch(fullUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          ...options?.headers,
        },
        body: body ? JSON.stringify(body) : undefined,
        signal: controller.signal,
      });

      clearTimeout(id);
      const data = (await response.json()) as T;

      return {
        data,
        status: response.status,
        statusText: response.statusText,
        ok: response.ok,
      };
    } catch (error) {
      clearTimeout(id);
      throw error;
    }
  }

  private buildUrl(base: string, params?: Record<string, string | number | boolean>): string {
    if (!params) return base;
    const url = new URL(base, window.location.origin);
    Object.entries(params).forEach(([key, val]) => {
      url.searchParams.append(key, String(val));
    });
    return url.toString();
  }
}

export const defaultHttpClient = new FetchHttpClient();

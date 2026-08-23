export interface RequestOptions extends RequestInit {
  timeoutMs?: number;
}

export class HttpClient {
  static async get<T>(url: string, options: RequestOptions = {}): Promise<T> {
    const { timeoutMs = 15000, ...fetchOptions } = options;

    const controller = new AbortController();
    const timer = setTimeout(() => controller.abort(), timeoutMs);

    try {
      const response = await fetch(url, {
        ...fetchOptions,
        signal: controller.signal,
        headers: {
          Accept: 'application/json',
          'User-Agent': 'PesoArgentino-Backend/1.0',
          ...(fetchOptions.headers || {}),
        },
      });

      clearTimeout(timer);

      if (!response.ok) {
        throw new Error(`HTTP ${response.status} from ${url}`);
      }

      return (await response.json()) as T;
    } catch (err: any) {
      clearTimeout(timer);
      if (err.name === 'AbortError') {
        throw new Error(`Timeout after ${timeoutMs}ms calling ${url}`);
      }
      throw err;
    }
  }
}

export interface HttpResponse<T> {
  data: T;
  status: number;
  statusText: string;
  ok: boolean;
}

export interface HttpRequestOptions {
  headers?: Record<string, string>;
  params?: Record<string, string | number | boolean>;
  timeoutMs?: number;
}

export interface HttpPort {
  get<T>(url: string, options?: HttpRequestOptions): Promise<HttpResponse<T>>;
  post<T>(url: string, body?: unknown, options?: HttpRequestOptions): Promise<HttpResponse<T>>;
}

export type HttpMethod = 'GET' | 'POST' | 'PUT' | 'DELETE' | 'PATCH' | 'HEAD' | 'OPTIONS';

export interface ApiConfig {
    method?: HttpMethod;
    headers?: Record<string, string>;
    body?: any;
    timeout?: number;
    signal?: AbortSignal;
    credentials?: 'include' | 'same-origin' | 'omit';
    mode?: 'cors' | 'no-cors' | 'same-origin';
    cache?: RequestCache;
    redirect?: RequestRedirect;
    referrerPolicy?: ReferrerPolicy;
}

export interface ApiResponse<T = any> {
    data: T;
    status: number;
    statusText: string;
    headers: Record<string, string>;
    url: string;
}

export interface ApiError extends Error {
    status?: number;
    statusText?: string;
    data?: any;
    url?: string;
}

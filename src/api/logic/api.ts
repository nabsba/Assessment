import type { ApiConfig, ApiError, ApiResponse } from "./type";

export class ApiService {
    private defaultTimeout = 30000; 
    private baseURL: string = '';

    constructor(baseURL?: string) {
        if (baseURL) {
            this.baseURL = baseURL;
        }
    }
    async request<T = any>(
        url: string,
        config: ApiConfig = {}
    ): Promise<ApiResponse<T>> {
        const abortController = config.signal
            ? { signal: config.signal, abort: () => { } }
            : new AbortController();

        const timeoutId = setTimeout(() => {
            abortController.abort();
        }, config.timeout || this.defaultTimeout);

        try {
            const fullUrl = this.baseURL ? `${this.baseURL}${url}` : url;

            const response = await fetch(fullUrl, {
                method: config.method || 'GET',
                headers: {
                    'Content-Type': 'application/json',
                    'Accept': 'application/json',
                    ...config.headers,
                },
                body: config.body ? JSON.stringify(config.body) : undefined,
                signal: abortController.signal,
                credentials: config.credentials,
                mode: config.mode,
                cache: config.cache,
                redirect: config.redirect,
                referrerPolicy: config.referrerPolicy,
            });

            clearTimeout(timeoutId);

            if (!response.ok) {
                const error = new Error(`HTTP ${response.status}: ${response.statusText}`) as ApiError;
                error.status = response.status;
                error.statusText = response.statusText;
                error.url = fullUrl;
                try {
                    error.data = await response.json().catch(() => response.text());
                } catch {
                    error.data = await response.text();
                }
                throw error;
            }

            // Handle empty responses (like 204 No Content)
            let data: any;
            const contentType = response.headers.get('content-type');
            if (contentType && contentType.includes('application/json')) {
                data = await response.json();
            } else {
                data = await response.text();
            }

            const headers: Record<string, string> = {};
            response.headers.forEach((value, key) => {
                headers[key] = value;
            });

            return {
                data,
                status: response.status,
                statusText: response.statusText,
                headers,
                url: fullUrl,
            };
        } catch (error) {
            clearTimeout(timeoutId);
            if (error instanceof Error && error.name === 'AbortError') {
                throw new Error('Request was aborted');
            }
            throw error;
        }
    }


    get<T = any>(url: string, config?: Omit<ApiConfig, 'method'>) {
        return this.request<T>(url, { ...config, method: 'GET' });
    }

    // post<T = any>(url: string, body?: any, config?: Omit<ApiConfig, 'method' | 'body'>) {
    //     return this.request<T>(url, { ...config, method: 'POST', body });
    // }

    // put<T = any>(url: string, body?: any, config?: Omit<ApiConfig, 'method' | 'body'>) {
    //     return this.request<T>(url, { ...config, method: 'PUT', body });
    // }

    // patch<T = any>(url: string, body?: any, config?: Omit<ApiConfig, 'method' | 'body'>) {
    //     return this.request<T>(url, { ...config, method: 'PATCH', body });
    // }

    // delete<T = any>(url: string, config?: Omit<ApiConfig, 'method'>) {
    //     return this.request<T>(url, { ...config, method: 'DELETE' });
    // }

    head<T = any>(url: string, config?: Omit<ApiConfig, 'method'>) {
        return this.request<T>(url, { ...config, method: 'HEAD' });
    }

    options<T = any>(url: string, config?: Omit<ApiConfig, 'method'>) {
        return this.request<T>(url, { ...config, method: 'OPTIONS' });
    }

   
    create(baseURL: string): ApiService {
        return new ApiService(baseURL);
    }

  
    setDefaultHeaders(headers: Record<string, string>): void {
       
    }

    /**
     * Helper to build query string from object
     */
    buildQueryString(params: Record<string, any>): string {
        const searchParams = new URLSearchParams();

        Object.entries(params).forEach(([key, value]) => {
            if (value !== undefined && value !== null) {
                if (Array.isArray(value)) {
                    value.forEach(item => searchParams.append(key, String(item)));
                } else {
                    searchParams.append(key, String(value));
                }
            }
        });

        return searchParams.toString();
    }
}


export default new ApiService();
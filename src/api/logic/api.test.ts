// ApiService.test.ts
import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { ApiService } from './api';

// Mock global fetch
vi.stubGlobal('fetch', vi.fn());

describe('ApiService', () => {
    let apiService: ApiService;

    beforeEach(() => {
        vi.clearAllMocks();
        apiService = new ApiService();
    });

    afterEach(() => {
        vi.restoreAllMocks();
    });

    describe('Constructor', () => {
        it('should create instance without baseURL', () => {
            const service = new ApiService();
            expect(service).toBeInstanceOf(ApiService);
        });

        it('should create instance with baseURL', () => {
            const baseURL = 'https://api.example.com';
            const service = new ApiService(baseURL);
            expect(service).toBeInstanceOf(ApiService);
        });
    });

    describe('request method', () => {
        const mockSuccessResponse = {
            id: 1,
            name: 'John Doe',
        };

        const mockHeaders = {
            'X-Custom-Header': 'value',
        };

        beforeEach(() => {
            vi.clearAllMocks();
        });

        it('should make a successful GET request', async () => {
            const mockResponse: any = {
                ok: true,
                status: 200,
                statusText: 'OK',
                headers: new Headers({
                    'content-type': 'application/json',
                }),
                json: vi.fn().mockResolvedValue(mockSuccessResponse),
            };

            vi.mocked(globalThis.fetch).mockResolvedValue(mockResponse);

            const result = await apiService.request('/test', {
                method: 'GET',
                headers: mockHeaders,
            });

            expect(globalThis.fetch).toHaveBeenCalledWith('/test', {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                    'Accept': 'application/json',
                    ...mockHeaders,
                },
                body: undefined,
                signal: expect.any(AbortSignal),
                credentials: undefined,
                mode: undefined,
                cache: undefined,
                redirect: undefined,
                referrerPolicy: undefined,
            });

            expect(result.data).toEqual(mockSuccessResponse);
            expect(result.status).toBe(200);
            expect(result.statusText).toBe('OK');
        });

        it('should use baseURL when provided', async () => {
            const baseURL = 'https://api.example.com';
            const apiServiceWithBase = new ApiService(baseURL);

            const mockResponse = {
                ok: true,
                status: 200,
                statusText: 'OK',
                headers: new Headers({
                    'content-type': 'application/json',
                }),
                json: vi.fn().mockResolvedValue(mockSuccessResponse),
            };

            (globalThis.fetch as jest.Mock).mockResolvedValue(mockResponse);

            await apiServiceWithBase.request('/users');

            expect(globalThis.fetch).toHaveBeenCalledWith(
                'https://api.example.com/users',
                expect.any(Object)
            );
        });

        it('should handle text response when content-type is not JSON', async () => {
            const mockResponse = {
                ok: true,
                status: 200,
                statusText: 'OK',
                headers: new Headers({
                    'content-type': 'text/plain',
                }),
                text: vi.fn().mockResolvedValue('plain text response'),
            };

            (globalThis.fetch as jest.Mock).mockResolvedValue(mockResponse);

            const result = await apiService.request('/text');

            expect(result.data).toBe('plain text response');
        });

        it('should handle empty response (204 No Content)', async () => {
            const mockResponse = {
                ok: true,
                status: 204,
                statusText: 'No Content',
                headers: new Headers(),
                text: vi.fn().mockResolvedValue(''),
            };

            (globalThis.fetch as jest.Mock).mockResolvedValue(mockResponse);

            const result = await apiService.request('/empty');

            expect(result.data).toBe('');
            expect(result.status).toBe(204);
        });

        it('should throw error on non-ok response with JSON error data', async () => {
            const errorData = { error: 'Not Found', code: 404 };

            const mockResponse = {
                ok: false,
                status: 404,
                statusText: 'Not Found',
                headers: new Headers({
                    'content-type': 'application/json',
                }),
                json: vi.fn().mockResolvedValue(errorData),
                text: vi.fn().mockResolvedValue(JSON.stringify(errorData)),
            };

            (globalThis.fetch as jest.Mock).mockResolvedValue(mockResponse);

            await expect(apiService.request('/not-found')).rejects.toMatchObject({
                message: 'HTTP 404: Not Found',
                status: 404,
                statusText: 'Not Found',
                data: errorData,
            });
        });

        it('should throw error on non-ok response with text error data', async () => {
            const errorText = 'Internal Server Error';

            const mockResponse = {
                ok: false,
                status: 500,
                statusText: 'Internal Server Error',
                headers: new Headers(),
                json: vi.fn().mockRejectedValue(new Error('Not JSON')),
                text: vi.fn().mockResolvedValue(errorText),
            };

            (globalThis.fetch as jest.Mock).mockResolvedValue(mockResponse);

            await expect(apiService.request('/error')).rejects.toMatchObject({
                message: 'HTTP 500: Internal Server Error',
                status: 500,
                statusText: 'Internal Server Error',
                data: errorText,
            });
        });
        it('should handle request timeout', async () => {
            vi.useFakeTimers();

            // Create an AbortError
            const abortError = new DOMException('The operation was aborted', 'AbortError');

            // Mock fetch to reject with AbortError after a delay
            let fetchReject: (error: any) => void;
            const fetchPromise = new Promise((_, reject) => {
                fetchReject = reject;
            });

            (globalThis.fetch as jest.Mock).mockReturnValue(fetchPromise);

            const requestPromise = apiService.request('/slow', { timeout: 1000 });

            // Advance timers by 1000ms - this triggers the timeout
            vi.advanceTimersByTime(1000);

            // Now reject the fetch promise with AbortError
            fetchReject!(abortError);

            // The request should reject with our custom error message
            await expect(requestPromise).rejects.toThrow('Request was aborted');

            vi.useRealTimers();
        });
        it('should handle network errors', async () => {
            (globalThis.fetch as jest.Mock).mockRejectedValue(new Error('Network error'));

            await expect(apiService.request('/network-error')).rejects.toThrow('Network error');
        });

        it('should propagate abort error correctly', async () => {
            const abortError = new Error('AbortError');
            abortError.name = 'AbortError';

            (globalThis.fetch as jest.Mock).mockRejectedValue(abortError);

            await expect(apiService.request('/aborted')).rejects.toThrow('Request was aborted');
        });

        it('should include request body for non-GET methods', async () => {
            const requestBody = { name: 'John', age: 30 };

            const mockResponse = {
                ok: true,
                status: 201,
                statusText: 'Created',
                headers: new Headers({
                    'content-type': 'application/json',
                }),
                json: vi.fn().mockResolvedValue({ id: 1, ...requestBody }),
            };

            (globalThis.fetch as jest.Mock).mockResolvedValue(mockResponse);

            await apiService.request('/users', {
                method: 'POST',
                body: requestBody,
            });

            expect(globalThis.fetch).toHaveBeenCalledWith(
                '/users',
                expect.objectContaining({
                    method: 'POST',
                    body: JSON.stringify(requestBody),
                })
            );
        });

        it('should handle custom credentials and mode', async () => {
            const mockResponse = {
                ok: true,
                status: 200,
                statusText: 'OK',
                headers: new Headers({
                    'content-type': 'application/json',
                }),
                json: vi.fn().mockResolvedValue({}),
            };

            (globalThis.fetch as jest.Mock).mockResolvedValue(mockResponse);

            await apiService.request('/secure', {
                credentials: 'include',
                mode: 'cors',
                cache: 'no-cache',
                redirect: 'follow',
                referrerPolicy: 'no-referrer',
            });

            expect(globalThis.fetch).toHaveBeenCalledWith(
                '/secure',
                expect.objectContaining({
                    credentials: 'include',
                    mode: 'cors',
                    cache: 'no-cache',
                    redirect: 'follow',
                    referrerPolicy: 'no-referrer',
                })
            );
        });
    });

    describe('HTTP method shortcuts', () => {
        beforeEach(() => {
            const mockResponse = {
                ok: true,
                status: 200,
                statusText: 'OK',
                headers: new Headers({
                    'content-type': 'application/json',
                }),
                json: vi.fn().mockResolvedValue({ success: true }),
            };

            (globalThis.fetch as jest.Mock).mockResolvedValue(mockResponse);
        });

        it('should make GET request via get() method', async () => {
            await apiService.get('/users');

            expect(globalThis.fetch).toHaveBeenCalledWith(
                '/users',
                expect.objectContaining({
                    method: 'GET',
                })
            );
        });

        it('should make HEAD request via head() method', async () => {
            await apiService.head('/resource');

            expect(globalThis.fetch).toHaveBeenCalledWith(
                '/resource',
                expect.objectContaining({
                    method: 'HEAD',
                })
            );
        });

        it('should make OPTIONS request via options() method', async () => {
            await apiService.options('/resource');

            expect(globalThis.fetch).toHaveBeenCalledWith(
                '/resource',
                expect.objectContaining({
                    method: 'OPTIONS',
                })
            );
        });

        it('should pass config through shortcut methods', async () => {
            const config = {
                headers: { 'X-Custom': 'Value' },
                credentials: 'include' as const,
            };

            await apiService.get('/users', config);

            expect(globalThis.fetch).toHaveBeenCalledWith(
                '/users',
                expect.objectContaining({
                    method: 'GET',
                    headers: expect.objectContaining({
                        'X-Custom': 'Value',
                    }),
                    credentials: 'include',
                })
            );
        });
    });

    describe('create method', () => {
        it('should create new ApiService instance with baseURL', () => {
            const baseURL = 'https://custom.api.com';
            const newService = apiService.create(baseURL);

            expect(newService).toBeInstanceOf(ApiService);
            expect(newService).not.toBe(apiService); // Should be a new instance
        });
    });

    describe('buildQueryString method', () => {
        it('should build query string from simple object', () => {
            const params = {
                name: 'John',
                age: 30,
                active: true,
            };

            const queryString = apiService.buildQueryString(params);
            expect(queryString).toBe('name=John&age=30&active=true');
        });

        it('should build query string with array values', () => {
            const params = {
                tags: ['js', 'ts', 'react'],
                ids: [1, 2, 3],
            };

            const queryString = apiService.buildQueryString(params);
            expect(queryString).toBe('tags=js&tags=ts&tags=react&ids=1&ids=2&ids=3');
        });

        it('should ignore undefined and null values', () => {
            const params = {
                name: 'John',
                age: undefined,
                city: null,
                country: 'USA',
            };

            const queryString = apiService.buildQueryString(params);
            expect(queryString).toBe('name=John&country=USA');
        });

        it('should handle empty object', () => {
            const queryString = apiService.buildQueryString({});
            expect(queryString).toBe('');
        });
    });

    describe('setDefaultHeaders method', () => {
        it('should be callable (currently does nothing)', () => {
            // This is a placeholder test since the method currently does nothing
            expect(() => {
                apiService.setDefaultHeaders({ 'Authorization': 'Bearer token' });
            }).not.toThrow();
        });
    });

    describe('Request cancellation', () => {
        it('should use provided abort signal', async () => {
            const abortController = new AbortController();

            const mockResponse = {
                ok: true,
                status: 200,
                statusText: 'OK',
                headers: new Headers({
                    'content-type': 'application/json',
                }),
                json: vi.fn().mockResolvedValue({}),
            };

            (globalThis.fetch as jest.Mock).mockResolvedValue(mockResponse);

            await apiService.request('/test', { signal: abortController.signal });

            expect(globalThis.fetch).toHaveBeenCalledWith(
                '/test',
                expect.objectContaining({
                    signal: abortController.signal,
                })
            );
        });
    });

    describe('Default instance export', () => {
        it('should export a default instance', async () => {
            // This test assumes the file exports a default instance
            // You might need to adjust based on your actual export
            const defaultExport = await import('./api');
            expect(defaultExport.default).toBeDefined();
        });
    });
});
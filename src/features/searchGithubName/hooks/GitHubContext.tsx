// contexts/SearchContext.tsx
import React, { createContext, useContext, useState, useCallback, useRef } from 'react';
import { ApiService } from '../../../api/logic/api';
import ENDPOINTS from '../../../api/data/constant';


type SearchState = {
    query: string;
    results: Record<number | string, UserGitHubProfile> | null;
    resultsOrder: string[] | null,
    loading: boolean;
    error: string | null;
    selectedUsers: Record<number, boolean>;
    apiLimitations: {
        remaining: number | null;
        rateLimit: number | null;
    };
    notification: string | null;
    pagination: {
        currentPage: number;
        totalItems: number;
        perPage: number;
        hasNextPage: boolean;
        hasPreviousPage: boolean;
        totalPages: number;
    }
};
export interface UserGitHubProfile {
    login: string
    id: number | string
    node_id: string
    avatar_url: string
    gravatar_id: string
    url: string
    html_url: string
    followers_url: string
    following_url: string
    gists_url: string
    starred_url: string
    subscriptions_url: string
    organizations_url: string
    repos_url: string
    events_url: string
    received_events_url: string
    type: string
    user_view_type: string
    site_admin: boolean
    score: number,
    isDuplicate?: boolean,
    originalId?: number
}

interface SearchContextInterface {
    state: SearchState;
    editMode: boolean;
    handleEditModeChange: () => void;
    updateQuery: (query: string) => void;
    searchUsers: (query: string, page?: number) => Promise<void>;
    deleteUserSelection: () => void;
    toggleUserSelection: (userId: number) => void;
    clearResults: () => void;
    abortSearch: () => void;
    duplicateUserSelection: () => void;
    toggleSelectAllUsers: (selectAll: boolean) => void;
    showNotification: (message: string, duration?: number) => () => void;

}

const SearchContext = createContext<SearchContextInterface | undefined>(undefined);
const apiService = new ApiService();
export const SearchProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [state, setState] = useState<SearchState>({
        query: '',
        results: {},
        resultsOrder: [],
        loading: false,
        error: null,
        selectedUsers: {},
        apiLimitations: { remaining: null, rateLimit: null },
        notification: null,
        pagination: {
            currentPage: 1,
            totalItems: 0,
            perPage: 30,
            hasNextPage: false,
            hasPreviousPage: false,
            totalPages: 0,
        }
    });

    const [editMode, setEditMode] = useState(false);
    const handleEditModeChange = () => {
        setEditMode(!editMode);
    }
    const abortControllerRef = useRef<AbortController | null>(null);
    const updateQuery = useCallback((query: string) => {
        setState(prev => ({ ...prev, query }));
    }, []);
    const searchUsers = useCallback(async (query: string, page: number = 1) => {
        if (!query.trim()) {
            setState(prev => ({ ...prev, results: {}, resultsOrder: [], error: null }));
            return;
        }

        const isNewSearch = page === 1;

        if (abortControllerRef.current) {
            abortControllerRef.current.abort();
        }
        abortControllerRef.current = new AbortController();

        setState(prev => ({
            ...prev,
            query,
            loading: true,
            error: null,
            ...(isNewSearch && { results: {}, resultsOrder: [] }),
        }));

        try {
            const response = await apiService.get(
                `${ENDPOINTS.GITHUB.SEARCH_USER}users?q=${encodeURIComponent(query)}&per_page=30&page=${page}`,
                {
                    headers: { Accept: 'application/vnd.github.v3+json' },
                    signal: abortControllerRef.current.signal,
                    timeout: 10000,
                }
            );

            setState(prev => {
                const items: UserGitHubProfile[] = response.data.items || [];
                const totalCount = response.data.total_count || 0;

                const resultsMap: Record<string, UserGitHubProfile> = isNewSearch
                    ? {}
                    : { ...(prev.results || {}) };

                const resultsOrder: string[] = isNewSearch
                    ? []
                    : [...(prev.resultsOrder || []).map(String)];

                for (const user of items) {
                    const id = String(user.id);

                    if (!resultsMap[id]) {
                        resultsOrder.push(id); // keep order only once
                    }

                    resultsMap[id] = user; // always update map
                }

                const totalPages = Math.ceil(totalCount / prev.pagination.perPage);
                const hasNextPage = page < totalPages;

                return {
                    ...prev,
                    results: resultsMap,
                    resultsOrder,
                    loading: false,
                    error: null,
                    apiLimitations: {
                        remaining: response.headers['x-ratelimit-remaining']
                            ? parseInt(response.headers['x-ratelimit-remaining'])
                            : null,
                        rateLimit: response.headers['x-ratelimit-limit']
                            ? parseInt(response.headers['x-ratelimit-limit'])
                            : null,
                    },
                    pagination: {
                        ...prev.pagination,
                        currentPage: page,
                        totalItems: totalCount,
                        totalPages,
                        hasNextPage,
                        hasPreviousPage: page > 1,
                    },
                };
            });
        } catch (error: any) {
            if (error.name === 'AbortError' || error.message?.includes('aborted')) return;

            setState(prev => ({
                ...prev,
                loading: false,
                error: error.message || 'Failed to search users',
                results: isNewSearch ? {} : prev.results,
                resultsOrder: isNewSearch ? [] : prev.resultsOrder, // keep order if paging fails
                pagination: {
                    ...prev.pagination,
                    currentPage: isNewSearch ? 1 : prev.pagination.currentPage,
                },
            }));
        }
    }, []);

    const deleteUserSelection = useCallback(() => {
        setState(prev => {
            const selectedIds = new Set(Object.keys(prev.selectedUsers));
            if (selectedIds.size === 0) return prev;

            const updatedResults = { ...prev.results };
            selectedIds.forEach(id => delete updatedResults[id]);

            const updatedOrder = prev.resultsOrder!.filter(
                id => !selectedIds.has(String(id))
            );

            return {
                ...prev,
                results: updatedResults,
                resultsOrder: updatedOrder as string[],
                selectedUsers: {},
            };
        });
    }, []);

    const duplicateUserSelection = useCallback(() => {
        setState(prev => {
            const selectedSet = new Set(Object.keys(prev.selectedUsers));
            if (selectedSet.size === 0 || !prev.results || !prev.resultsOrder) return prev;

            const updatedResults: Record<string, UserGitHubProfile> = {
                ...(prev.results as Record<string, UserGitHubProfile>),
            };

            const updatedOrder: string[] = [];

            for (const rawId of prev.resultsOrder as Array<number | string>) {
                const id = String(rawId);

                updatedOrder.push(id);

                if (!selectedSet.has(id)) continue;

                const original = updatedResults[id];
                if (!original || original.isDuplicate) continue;

                const duplicateId = `${id}_copy`;
                if (updatedResults[duplicateId]) continue;

                updatedResults[duplicateId] = {
                    ...original,
                    id: duplicateId,
                    isDuplicate: true,
                    originalId: original.originalId ?? original.id as number,
                };

                updatedOrder.push(duplicateId);
            }

            return {
                ...prev,
                results: updatedResults,
                resultsOrder: updatedOrder,
            };
        });
    }, []);


    const toggleUserSelection = useCallback((userId: number) => {
        setState(prev => {
            const isSelected = prev.selectedUsers[userId];
            const updatedUsers = { ...prev.selectedUsers };

            if (isSelected) {
                delete updatedUsers[userId];
            } else {
                updatedUsers[userId] = true;
            }

            return {
                ...prev,
                selectedUsers: updatedUsers,
            };
        });
    }, []);
    const clearResults = useCallback(() => {
        setState(prev => ({ ...prev, results: {}, error: null }));
    }, []);
    const abortSearch = useCallback(() => {
        if (abortControllerRef.current) {
            abortControllerRef.current.abort();
            abortControllerRef.current = null;
            setState(prev => ({ ...prev, loading: false }));
        }
    }, []);
    const toggleSelectAllUsers = useCallback((selectAll: boolean) => {
        setState(prev => {
            if (selectAll) {
                const allSelectedUsers: Record<number, boolean> = {};

                if (prev.results) {
                    Object.values(prev.results).forEach(user => {
                        if (user && (typeof user.id === 'number' || typeof user.id === 'string')) {
                            allSelectedUsers[user.id as unknown as number] = true;
                        }
                    });
                }

                return {
                    ...prev,
                    selectedUsers: allSelectedUsers,
                };
            } else {
                return {
                    ...prev,
                    selectedUsers: {},
                };
            }
        });
    }, []);
    const showNotification = useCallback((message: string, duration: number = 3000) => {
        setState(prev => ({ ...prev, notification: message }));

        const timeoutId = setTimeout(() => {
            setState(prev => {
                if (prev.notification === message) {
                    return { ...prev, notification: null };
                }
                return prev;
            });
        }, duration);

        return () => {
            clearTimeout(timeoutId);
            setState(prev => ({ ...prev, notification: null }));
        };
    }, []);
    return (
        <SearchContext.Provider
            value={{
                state,
                updateQuery,
                searchUsers,
                toggleUserSelection,
                clearResults,
                abortSearch,
                deleteUserSelection,
                duplicateUserSelection,
                toggleSelectAllUsers,
                editMode,
                handleEditModeChange,
                showNotification,
            }}
        >
            {children}
        </SearchContext.Provider>
    );
};

export const useSearchContext = () => {
    const context = useContext(SearchContext);
    if (!context) {
        throw new Error('useSearchContext must be used within a SearchProvider');
    }
    return context;
};
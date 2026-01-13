// contexts/SearchContext.tsx
import React, { createContext, useContext, useState, useCallback, useRef } from 'react';
import { ApiService } from '../../../api/logic/api';
import ENDPOINTS from '../../../api/data/constant';


type SearchState = {
    query: string;
    results: Record<number|string, UserGitHubProfile> | null;
    loading: boolean;
    error: string | null;
    selectedUsers: Record<number, boolean>; // For multi-select
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
    score: number
}

interface SearchContextInterface {
    state: SearchState;
    editMode: boolean;
    handleEditModeChange: () => void;
    updateQuery: (query: string) => void;
    searchUsers: (query: string) => Promise<void>;
    deleteUserSelection: () => void;
    toggleUserSelection: (userId: number) => void;
    clearResults: () => void;
    abortSearch: () => void;
    duplicateUserSelection: () => void;
    toggleSelectAllUsers: (selectAll: boolean) => void;
}

const SearchContext = createContext<SearchContextInterface | undefined>(undefined);
const apiService = new ApiService();
export const SearchProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [state, setState] = useState<SearchState>({
        query: '',
        results: null,
        loading: false,
        error: null,
        selectedUsers: {},
    });
const [editMode, setEditMode] = useState(false);
const handleEditModeChange = () => {
    setEditMode(!editMode);
}
    const abortControllerRef = useRef<AbortController | null>(null);

    const updateQuery = useCallback((query: string) => {
        setState(prev => ({ ...prev, query }));
    }, []);

    const searchUsers = useCallback(async (query: string) => {
        if (!query.trim()) {
            setState(prev => ({ ...prev, results: {}, error: null }));
            return;
        }

        if (abortControllerRef.current) {
            abortControllerRef.current.abort();
        }

        abortControllerRef.current = new AbortController();

        setState(prev => ({ ...prev, loading: true, error: null }));

        try {
            const response = await apiService.get(
                `${ENDPOINTS.GITHUB.SEARCH_USER}users?q=${encodeURIComponent(query)}&per_page=30`,
                {
                    headers: {
                        'Accept': 'application/vnd.github.v3+json',
                    },
                    signal: abortControllerRef.current.signal,
                    timeout: 10000,
                }
            );

            setState(prev => {
                const items = response.data.items || [];
                const resultsMap: Record<number, UserGitHubProfile> = {};
                const resultsOrder: number[] = [];

                items.forEach((user: UserGitHubProfile) => {
                    resultsMap[user.id as unknown as number] = user;
                    resultsOrder.push(user.id as unknown as number);
                });

                return {
                    ...prev,
                    results: resultsMap,
                    resultsOrder: resultsOrder,
                    loading: false,
                    error: null,
                };
            });
        } catch (error: any) {

            if (error.name === 'AbortError' || error.message?.includes('aborted')) {
                return;
            }


            setState(prev => ({
                ...prev,
                loading: false,
                error: error.message || 'Failed to search users',
                results: {},
            }));
        }
    }, []);
    const deleteUserSelection = useCallback(() => {
        setState(prev => {
            if (Object.keys(prev.selectedUsers).length === 0) {
                return prev;
            }

            const selectedUserIds = Object.keys(prev.selectedUsers);
            const updatedResults = { ...prev.results };

            selectedUserIds.forEach(id => {
                delete updatedResults[id];
            });

            return {
                ...prev,
                selectedUsers: {},
                results: updatedResults,
            };
        });
    }, []);
    const duplicateUserSelection = useCallback(() => {
        setState(prev => {
            if (Object.keys(prev.selectedUsers).length === 0) {
                return prev;
            }

            if (!prev.results) {
                return prev;
            }

            const selectedUserIds = Object.keys(prev.selectedUsers);
            const updatedResults = { ...prev.results };

            selectedUserIds.forEach(id => {
                const originalUser = prev.results![parseInt(id)];
                if (originalUser) {
                 
                    const duplicateId = `${originalUser.id}_copy`;

                    if (updatedResults[duplicateId]) {
                        console.log(`Duplicate ${duplicateId} already exists, skipping`);
                        return; // Skip - duplicate already exists
                    }

                    const duplicate = {
                        ...originalUser,
                        id: duplicateId, // String ID: "1_copy"
                        login: `${originalUser.login}`,
                        isDuplicate: true,
                        originalId: originalUser.id,
                    };

          
                    updatedResults[duplicateId] = duplicate;
                }
            });

            return {
                ...prev,
                results: updatedResults,
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
                handleEditModeChange
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
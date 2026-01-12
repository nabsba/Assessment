// contexts/SearchContext.tsx
import React, { createContext, useContext, useState, useCallback, useRef } from 'react';
import { ApiService } from '../../../api/logic/api';
import ENDPOINTS from '../../../api/data/constant';


type SearchState = {
    query: string;
    results: Record<number|string, UserGitHubProfile>;
    loading: boolean;
    error: string | null;
    selectedUsers: Record<number, boolean>; // For multi-select
};
export interface UserGitHubProfile {
    login: string
    id: number
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
    updateQuery: (query: string) => void;
    searchUsers: (query: string) => Promise<void>;
    deleteUserSelection: () => void;
    toggleUserSelection: (userId: number) => void;
    clearResults: () => void;
    abortSearch: () => void;
    duplicateUserSelection: () => void;
}

const SearchContext = createContext<SearchContextInterface | undefined>(undefined);
const apiService = new ApiService();
export const SearchProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [state, setState] = useState<SearchState>({
        query: '',
        results: {
            "125379": {
                "login": "nabil",
                "id": 125379,
                "node_id": "MDQ6VXNlcjEyNTM3OQ==",
                "avatar_url": "https://avatars.githubusercontent.com/u/125379?v=4",
                "gravatar_id": "",
                "url": "https://api.github.com/users/nabil",
                "html_url": "https://github.com/nabil",
                "followers_url": "https://api.github.com/users/nabil/followers",
                "following_url": "https://api.github.com/users/nabil/following{/other_user}",
                "gists_url": "https://api.github.com/users/nabil/gists{/gist_id}",
                "starred_url": "https://api.github.com/users/nabil/starred{/owner}{/repo}",
                "subscriptions_url": "https://api.github.com/users/nabil/subscriptions",
                "organizations_url": "https://api.github.com/users/nabil/orgs",
                "repos_url": "https://api.github.com/users/nabil/repos",
                "events_url": "https://api.github.com/users/nabil/events{/privacy}",
                "received_events_url": "https://api.github.com/users/nabil/received_events",
                "type": "User",
                "user_view_type": "public",
                "site_admin": false,
                "score": 1
            },
            "1452696": {
                "login": "happykhan",
                "id": 1452696,
                "node_id": "MDQ6VXNlcjE0NTI2OTY=",
                "avatar_url": "https://avatars.githubusercontent.com/u/1452696?v=4",
                "gravatar_id": "",
                "url": "https://api.github.com/users/happykhan",
                "html_url": "https://github.com/happykhan",
                "followers_url": "https://api.github.com/users/happykhan/followers",
                "following_url": "https://api.github.com/users/happykhan/following{/other_user}",
                "gists_url": "https://api.github.com/users/happykhan/gists{/gist_id}",
                "starred_url": "https://api.github.com/users/happykhan/starred{/owner}{/repo}",
                "subscriptions_url": "https://api.github.com/users/happykhan/subscriptions",
                "organizations_url": "https://api.github.com/users/happykhan/orgs",
                "repos_url": "https://api.github.com/users/happykhan/repos",
                "events_url": "https://api.github.com/users/happykhan/events{/privacy}",
                "received_events_url": "https://api.github.com/users/happykhan/received_events",
                "type": "User",
                "user_view_type": "public",
                "site_admin": false,
                "score": 1
            },
            "1793238": {
                "login": "nhachicha",
                "id": 1793238,
                "node_id": "MDQ6VXNlcjE3OTMyMzg=",
                "avatar_url": "https://avatars.githubusercontent.com/u/1793238?v=4",
                "gravatar_id": "",
                "url": "https://api.github.com/users/nhachicha",
                "html_url": "https://github.com/nhachicha",
                "followers_url": "https://api.github.com/users/nhachicha/followers",
                "following_url": "https://api.github.com/users/nhachicha/following{/other_user}",
                "gists_url": "https://api.github.com/users/nhachicha/gists{/gist_id}",
                "starred_url": "https://api.github.com/users/nhachicha/starred{/owner}{/repo}",
                "subscriptions_url": "https://api.github.com/users/nhachicha/subscriptions",
                "organizations_url": "https://api.github.com/users/nhachicha/orgs",
                "repos_url": "https://api.github.com/users/nhachicha/repos",
                "events_url": "https://api.github.com/users/nhachicha/events{/privacy}",
                "received_events_url": "https://api.github.com/users/nhachicha/received_events",
                "type": "User",
                "user_view_type": "public",
                "site_admin": false,
                "score": 1
            },
            "2975322": {
                "login": "thebiltheory",
                "id": 2975322,
                "node_id": "MDQ6VXNlcjI5NzUzMjI=",
                "avatar_url": "https://avatars.githubusercontent.com/u/2975322?v=4",
                "gravatar_id": "",
                "url": "https://api.github.com/users/thebiltheory",
                "html_url": "https://github.com/thebiltheory",
                "followers_url": "https://api.github.com/users/thebiltheory/followers",
                "following_url": "https://api.github.com/users/thebiltheory/following{/other_user}",
                "gists_url": "https://api.github.com/users/thebiltheory/gists{/gist_id}",
                "starred_url": "https://api.github.com/users/thebiltheory/starred{/owner}{/repo}",
                "subscriptions_url": "https://api.github.com/users/thebiltheory/subscriptions",
                "organizations_url": "https://api.github.com/users/thebiltheory/orgs",
                "repos_url": "https://api.github.com/users/thebiltheory/repos",
                "events_url": "https://api.github.com/users/thebiltheory/events{/privacy}",
                "received_events_url": "https://api.github.com/users/thebiltheory/received_events",
                "type": "User",
                "user_view_type": "public",
                "site_admin": false,
                "score": 1
            },
            "20807178": {
                "login": "KL13NT",
                "id": 20807178,
                "node_id": "MDQ6VXNlcjIwODA3MTc4",
                "avatar_url": "https://avatars.githubusercontent.com/u/20807178?v=4",
                "gravatar_id": "",
                "url": "https://api.github.com/users/KL13NT",
                "html_url": "https://github.com/KL13NT",
                "followers_url": "https://api.github.com/users/KL13NT/followers",
                "following_url": "https://api.github.com/users/KL13NT/following{/other_user}",
                "gists_url": "https://api.github.com/users/KL13NT/gists{/gist_id}",
                "starred_url": "https://api.github.com/users/KL13NT/starred{/owner}{/repo}",
                "subscriptions_url": "https://api.github.com/users/KL13NT/subscriptions",
                "organizations_url": "https://api.github.com/users/KL13NT/orgs",
                "repos_url": "https://api.github.com/users/KL13NT/repos",
                "events_url": "https://api.github.com/users/KL13NT/events{/privacy}",
                "received_events_url": "https://api.github.com/users/KL13NT/received_events",
                "type": "User",
                "user_view_type": "public",
                "site_admin": false,
                "score": 1
            },
            "21167899": {
                "login": "nabil6391",
                "id": 21167899,
                "node_id": "MDQ6VXNlcjIxMTY3ODk5",
                "avatar_url": "https://avatars.githubusercontent.com/u/21167899?v=4",
                "gravatar_id": "",
                "url": "https://api.github.com/users/nabil6391",
                "html_url": "https://github.com/nabil6391",
                "followers_url": "https://api.github.com/users/nabil6391/followers",
                "following_url": "https://api.github.com/users/nabil6391/following{/other_user}",
                "gists_url": "https://api.github.com/users/nabil6391/gists{/gist_id}",
                "starred_url": "https://api.github.com/users/nabil6391/starred{/owner}{/repo}",
                "subscriptions_url": "https://api.github.com/users/nabil6391/subscriptions",
                "organizations_url": "https://api.github.com/users/nabil6391/orgs",
                "repos_url": "https://api.github.com/users/nabil6391/repos",
                "events_url": "https://api.github.com/users/nabil6391/events{/privacy}",
                "received_events_url": "https://api.github.com/users/nabil6391/received_events",
                "type": "User",
                "user_view_type": "public",
                "site_admin": false,
                "score": 1
            },
            "35051247": {
                "login": "fadynabil10",
                "id": 35051247,
                "node_id": "MDQ6VXNlcjM1MDUxMjQ3",
                "avatar_url": "https://avatars.githubusercontent.com/u/35051247?v=4",
                "gravatar_id": "",
                "url": "https://api.github.com/users/fadynabil10",
                "html_url": "https://github.com/fadynabil10",
                "followers_url": "https://api.github.com/users/fadynabil10/followers",
                "following_url": "https://api.github.com/users/fadynabil10/following{/other_user}",
                "gists_url": "https://api.github.com/users/fadynabil10/gists{/gist_id}",
                "starred_url": "https://api.github.com/users/fadynabil10/starred{/owner}{/repo}",
                "subscriptions_url": "https://api.github.com/users/fadynabil10/subscriptions",
                "organizations_url": "https://api.github.com/users/fadynabil10/orgs",
                "repos_url": "https://api.github.com/users/fadynabil10/repos",
                "events_url": "https://api.github.com/users/fadynabil10/events{/privacy}",
                "received_events_url": "https://api.github.com/users/fadynabil10/received_events",
                "type": "User",
                "user_view_type": "public",
                "site_admin": false,
                "score": 1
            },
            "45570191": {
                "login": "moatazeldebsy",
                "id": 45570191,
                "node_id": "MDQ6VXNlcjQ1NTcwMTkx",
                "avatar_url": "https://avatars.githubusercontent.com/u/45570191?v=4",
                "gravatar_id": "",
                "url": "https://api.github.com/users/moatazeldebsy",
                "html_url": "https://github.com/moatazeldebsy",
                "followers_url": "https://api.github.com/users/moatazeldebsy/followers",
                "following_url": "https://api.github.com/users/moatazeldebsy/following{/other_user}",
                "gists_url": "https://api.github.com/users/moatazeldebsy/gists{/gist_id}",
                "starred_url": "https://api.github.com/users/moatazeldebsy/starred{/owner}{/repo}",
                "subscriptions_url": "https://api.github.com/users/moatazeldebsy/subscriptions",
                "organizations_url": "https://api.github.com/users/moatazeldebsy/orgs",
                "repos_url": "https://api.github.com/users/moatazeldebsy/repos",
                "events_url": "https://api.github.com/users/moatazeldebsy/events{/privacy}",
                "received_events_url": "https://api.github.com/users/moatazeldebsy/received_events",
                "type": "User",
                "user_view_type": "public",
                "site_admin": false,
                "score": 1
            },
            "60401401": {
                "login": "NabilHY",
                "id": 60401401,
                "node_id": "MDQ6VXNlcjYwNDAxNDAx",
                "avatar_url": "https://avatars.githubusercontent.com/u/60401401?v=4",
                "gravatar_id": "",
                "url": "https://api.github.com/users/NabilHY",
                "html_url": "https://github.com/NabilHY",
                "followers_url": "https://api.github.com/users/NabilHY/followers",
                "following_url": "https://api.github.com/users/NabilHY/following{/other_user}",
                "gists_url": "https://api.github.com/users/NabilHY/gists{/gist_id}",
                "starred_url": "https://api.github.com/users/NabilHY/starred{/owner}{/repo}",
                "subscriptions_url": "https://api.github.com/users/NabilHY/subscriptions",
                "organizations_url": "https://api.github.com/users/NabilHY/orgs",
                "repos_url": "https://api.github.com/users/NabilHY/repos",
                "events_url": "https://api.github.com/users/NabilHY/events{/privacy}",
                "received_events_url": "https://api.github.com/users/NabilHY/received_events",
                "type": "User",
                "user_view_type": "public",
                "site_admin": false,
                "score": 1
            },
            "81329611": {
                "login": "NabilAFK",
                "id": 81329611,
                "node_id": "MDQ6VXNlcjgxMzI5NjEx",
                "avatar_url": "https://avatars.githubusercontent.com/u/81329611?v=4",
                "gravatar_id": "",
                "url": "https://api.github.com/users/NabilAFK",
                "html_url": "https://github.com/NabilAFK",
                "followers_url": "https://api.github.com/users/NabilAFK/followers",
                "following_url": "https://api.github.com/users/NabilAFK/following{/other_user}",
                "gists_url": "https://api.github.com/users/NabilAFK/gists{/gist_id}",
                "starred_url": "https://api.github.com/users/NabilAFK/starred{/owner}{/repo}",
                "subscriptions_url": "https://api.github.com/users/NabilAFK/subscriptions",
                "organizations_url": "https://api.github.com/users/NabilAFK/orgs",
                "repos_url": "https://api.github.com/users/NabilAFK/repos",
                "events_url": "https://api.github.com/users/NabilAFK/events{/privacy}",
                "received_events_url": "https://api.github.com/users/NabilAFK/received_events",
                "type": "User",
                "user_view_type": "public",
                "site_admin": false,
                "score": 1
            }
        },
        loading: false,
        error: null,
        selectedUsers: [],
    });

    const abortControllerRef = useRef<AbortController | null>(null);

    const updateQuery = useCallback((query: string) => {
        setState(prev => ({ ...prev, query }));
    }, []);

    const searchUsers = useCallback(async (query: string) => {
        if (!query.trim()) {
            setState(prev => ({ ...prev, results: [], error: null }));
            return;
        }

        if (abortControllerRef.current) {
            abortControllerRef.current.abort();
        }

        abortControllerRef.current = new AbortController();

        setState(prev => ({ ...prev, loading: true, error: null }));

        try {
            const response = await apiService.get(
                `${ENDPOINTS.GITHUB.SEARCH_USER}${encodeURIComponent(query)}&per_page=10`,
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
                    resultsMap[user.id] = user;
                    resultsOrder.push(user.id);
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
            if (error.name === 'AbortError') {
                return;
            }

            setState(prev => ({
                ...prev,
                loading: false,
                error: error.message || 'Failed to search users',
                results: [],
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
                // Don't use parseInt() - delete by the actual ID (which could be string like "1_copy")
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

            const selectedUserIds = Object.keys(prev.selectedUsers);
            const updatedResults = { ...prev.results };

            selectedUserIds.forEach(id => {
                const originalUser = prev.results[parseInt(id)];
                if (originalUser) {
                    // Check if duplicate already exists
                    const duplicateId = `${originalUser.id}_copy`;

                    if (updatedResults[duplicateId]) {
                        console.log(`Duplicate ${duplicateId} already exists, skipping`);
                        return; // Skip - duplicate already exists
                    }

                    // Create duplicate with ID like "1_copy"
                    const duplicate = {
                        ...originalUser,
                        id: duplicateId, // String ID: "1_copy"
                        login: `${originalUser.login}`,
                        isDuplicate: true,
                        originalId: originalUser.id,
                    };

                    // Add the duplicate
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
                delete updatedUsers[userId]; // Suppression
            } else {
                updatedUsers[userId] = true; // Ajout
            }

            return {
                ...prev,
                selectedUsers: updatedUsers,
            };
        });
    }, []);
    const clearResults = useCallback(() => {
        setState(prev => ({ ...prev, results: [], error: null }));
    }, []);
    const abortSearch = useCallback(() => {
        if (abortControllerRef.current) {
            abortControllerRef.current.abort();
            abortControllerRef.current = null;
            setState(prev => ({ ...prev, loading: false }));
        }
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
                duplicateUserSelection
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
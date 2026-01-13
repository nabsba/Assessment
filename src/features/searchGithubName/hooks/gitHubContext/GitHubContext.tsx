import React, { createContext, useCallback, useContext, useRef, useReducer } from "react";
import { ApiService } from "../../../../api/logic/api";
import ENDPOINTS from "../../../../api/data/constant";

import { initialSearchState } from "./initialState";
import { searchReducer } from "./reducer";
import type { SearchContextInterface } from "../../types/content.types";

const SearchContext = createContext<SearchContextInterface | undefined>(undefined);
const apiService = new ApiService();

export const SearchProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [state, dispatch] = useReducer(searchReducer, initialSearchState);

    const abortControllerRef = useRef<AbortController | null>(null);

    const updateQuery = useCallback((query: string) => {
        dispatch({ type: "SET_QUERY", query });
    }, []);

    const abortSearch = useCallback(() => {
        abortControllerRef.current?.abort();
        abortControllerRef.current = null;
        dispatch({ type: "ABORT_SEARCH" });
    }, []);

    const searchUsers = useCallback(async (query: string, page: number = 1) => {
        if (!query.trim()) {
            dispatch({ type: "CLEAR_RESULTS" });
            return;
        }

        const isNewSearch = page === 1;

        // cancel previous request
        abortControllerRef.current?.abort();
        abortControllerRef.current = new AbortController();

        dispatch({ type: "SEARCH_START", query, isNewSearch });

        try {
            const response = await apiService.get(
                `${ENDPOINTS.GITHUB.SEARCH_USER}users?q=${encodeURIComponent(query)}&per_page=30&page=${page}`,
                {
                    headers: { Accept: "application/vnd.github.v3+json" },
                    signal: abortControllerRef.current.signal,
                    timeout: 10000,
                }
            );

            const items = response.data.items || [];
            const totalCount = response.data.total_count || 0;

            dispatch({
                type: "SEARCH_SUCCESS",
                items,
                totalCount,
                page,
                isNewSearch,
                apiLimitations: {
                    remaining: response.headers["x-ratelimit-remaining"]
                        ? parseInt(response.headers["x-ratelimit-remaining"], 10)
                        : null,
                    rateLimit: response.headers["x-ratelimit-limit"]
                        ? parseInt(response.headers["x-ratelimit-limit"], 10)
                        : null,
                },
            });
        } catch (error: any) {
            if (error.name === "AbortError" || error.message?.includes("aborted")) return;

            dispatch({
                type: "SEARCH_ERROR",
                isNewSearch,
                message: error.message || "Failed to search users",
            });
        }
    }, []);

    const toggleUserSelection = useCallback((userId: number | string) => {
        dispatch({ type: "TOGGLE_USER", userId });
    }, []);

    const toggleSelectAllUsers = useCallback((selectAll: boolean) => {
        dispatch({ type: "SELECT_ALL", selectAll });
    }, []);

    const deleteUserSelection = useCallback(() => {
        dispatch({ type: "DELETE_SELECTED" });
    }, []);


    const clearResults = useCallback(() => {
        dispatch({ type: "CLEAR_RESULTS" });
    }, []);

    const showNotification = useCallback((message: string, duration: number = 3000) => {
        dispatch({ type: "SHOW_NOTIFICATION", message });

        const timeoutId = setTimeout(() => {
            dispatch({ type: "SHOW_NOTIFICATION", message: null });
        }, duration);

        return () => {
            clearTimeout(timeoutId);
            dispatch({ type: "SHOW_NOTIFICATION", message: null });
        };
    }, []);
    const duplicateUserSelection = useCallback(() => {
        dispatch({
            type: "DUPLICATE_SELECTED",
            showNotification
        });
    }, [showNotification]);
    return (
        <SearchContext.Provider
            value={{
                state,
                updateQuery,
                searchUsers,
                deleteUserSelection,
                toggleUserSelection,
                clearResults,
                abortSearch,
                duplicateUserSelection,
                toggleSelectAllUsers,
                showNotification,
            }}
        >
            {children}
        </SearchContext.Provider>
    );
};

export const useSearchContext = () => {
    const context = useContext(SearchContext);
    if (!context) throw new Error("useSearchContext must be used within a SearchProvider");
    return context;
};

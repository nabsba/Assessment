import type { SearchState, UserGitHubProfile } from "../../types/content.types";
import { deleteSelected, duplicateSelectedInOrder, mergeSearchResults, toId } from "../../utils/searchUtils";


type ApiLimits = { remaining: number | null; rateLimit: number | null };

export type SearchAction =
    | { type: "SET_QUERY"; query: string }
    | { type: "SEARCH_START"; query: string; isNewSearch: boolean }
    | {
        type: "SEARCH_SUCCESS";
        items: UserGitHubProfile[];
        totalCount: number;
        page: number;
        apiLimitations: ApiLimits;
        isNewSearch: boolean;
    }
    | { type: "SEARCH_ERROR"; message: string; isNewSearch: boolean }
    | { type: "ABORT_SEARCH" }
    | { type: "CLEAR_RESULTS" }
    | { type: "TOGGLE_USER"; userId: number | string }
    | { type: "SELECT_ALL"; selectAll: boolean }
    | { type: "DELETE_SELECTED" }
    | { type: "DUPLICATE_SELECTED" }
    | { type: "SHOW_NOTIFICATION"; message: string | null };

export function searchReducer(state: SearchState, action: SearchAction): SearchState {
    switch (action.type) {
        case "SET_QUERY":
            return { ...state, query: action.query };

        case "SEARCH_START":
            return {
                ...state,
                query: action.query,
                loading: true,
                error: null,
                ...(action.isNewSearch ? { results: {}, resultsOrder: [] } : null),
            };

        case "SEARCH_SUCCESS": {
            const { results, order } = mergeSearchResults(
                state.results,
                state.resultsOrder,
                action.items,
                action.isNewSearch
            );

            const totalPages = Math.ceil(action.totalCount / state.pagination.perPage);
            const hasNextPage = action.page < totalPages;

            return {
                ...state,
                results,
                resultsOrder: order,
                loading: false,
                error: null,
                apiLimitations: action.apiLimitations,
                pagination: {
                    ...state.pagination,
                    currentPage: action.page,
                    totalItems: action.totalCount,
                    totalPages,
                    hasNextPage,
                    hasPreviousPage: action.page > 1,
                },
            };
        }

        case "SEARCH_ERROR":
            return {
                ...state,
                loading: false,
                error: action.message,
                ...(action.isNewSearch ? { results: {}, resultsOrder: [], pagination: { ...state.pagination, currentPage: 1 } } : null),
            };

        case "ABORT_SEARCH":
            return { ...state, loading: false };

        case "CLEAR_RESULTS":
            return { ...state, results: {}, resultsOrder: [], error: null };

        case "TOGGLE_USER": {
            const id = toId(action.userId);
            const next = { ...state.selectedUsers };
            if (next[id]) delete next[id];
            else next[id] = true;
            return { ...state, selectedUsers: next };
        }

        case "SELECT_ALL":
            if (!action.selectAll) return { ...state, selectedUsers: {} };

            return {
                ...state,
                selectedUsers: Object.fromEntries(Object.keys(state.results).map(id => [id, true])),
            };

        case "DELETE_SELECTED": {
            const { results, order } = deleteSelected(state.results, state.resultsOrder, state.selectedUsers);
            return { ...state, results, resultsOrder: order, selectedUsers: {} };
        }

        case "DUPLICATE_SELECTED": {
            const { results, order, alreadyHasDuplicates  } = duplicateSelectedInOrder(state.results, state.resultsOrder, state.selectedUsers);
            console.log(alreadyHasDuplicates)
            return { ...state, results, resultsOrder: order };
        }

        case "SHOW_NOTIFICATION":
            return { ...state, notification: action.message };

        default:
            return state;
    }
}

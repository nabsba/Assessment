import type { SearchState } from "../../types/content.types";


export const initialSearchState: SearchState = {
    query: "",
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
    },
};

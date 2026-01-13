export interface ContentConfig {
    header: {
        title: string;
    };
    searchInput: {
        placeholder: string;
        notifications: {
            rateLimitWarning: string;
            rateLimitExceeded: string;
        };
    };
    card: {
        checkbox: {
            text: string;
            alt: string;
        };
        avatar: {
            alt: string;
            defaultText: string;
        };
        button: {
            text: string;
        };
        noResults: string;
        selectedCount: string;
    };
    menu: {
        editModeLabel: string;
        indiceSelections: string;
        indiceSelection: string;
        selectAll: string;
    };
    mainListCard: {
        title: string;
        emptyState: string;
        startState: string;
    };
}

export interface UserGitHubProfile {
    login: string;
    id: number | string;
    node_id: string;
    avatar_url: string;
    gravatar_id: string;
    url: string;
    html_url: string;
    followers_url: string;
    following_url: string;
    gists_url: string;
    starred_url: string;
    subscriptions_url: string;
    organizations_url: string;
    repos_url: string;
    events_url: string;
    received_events_url: string;
    type: string;
    user_view_type: string;
    site_admin: boolean;
    score: number;
    isDuplicate?: boolean;
    originalId?: number;
}

export type SearchState = {
    query: string;
    results: Record<string, UserGitHubProfile>;
    resultsOrder: string[];
    loading: boolean;
    error: string | null;
    selectedUsers: Record<string, boolean>;
    apiLimitations: { remaining: number | null; rateLimit: number | null, rateResetTime: number | null };
    notification: string | null;
    pagination: {
        currentPage: number;
        totalItems: number;
        perPage: number;
        hasNextPage: boolean;
        hasPreviousPage: boolean;
        totalPages: number;
    };
};

export type SearchContextInterface = {
    state: SearchState;
    updateQuery: (query: string) => void;
    searchUsers: (query: string, page?: number) => Promise<void>;
    deleteUserSelection: () => void;
    toggleUserSelection: (userId: number | string) => void;
    clearResults: () => void;
    abortSearch: () => void;
    duplicateUserSelection: () => void;
    toggleSelectAllUsers: (selectAll: boolean) => void;
    showNotification: (message: string, duration?: number) => () => void;
};

import type { UserGitHubProfile } from "../types/content.types";


export interface SearchConfig {
    debounceDelay?: number;
    minLength?: number;
    maxLength?: number;
    allowEmpty?: boolean;
}

export function createDebouncedSearch<T extends (...args: any[]) => any>(
    searchFn: T,
    config: SearchConfig = {}
) {
    const {
        debounceDelay = 500,
        minLength = 1,
        maxLength = 100,
        allowEmpty = false,
    } = config;

    let timeoutId: ReturnType<typeof setTimeout> | null = null;

    const debouncedFn = (...args: Parameters<T>) => {
        const searchTerm = args[0] as string;

        // Validation
        if (!allowEmpty && !searchTerm.trim()) {
            return;
        }

        if (searchTerm.length < minLength) {
            return;
        }

        if (searchTerm.length > maxLength) {
            console.warn(`Search term exceeds max length of ${maxLength}`);
            return;
        }

        // Clear previous timeout
        if (timeoutId) {
            clearTimeout(timeoutId);
        }

        // Set new timeout
        timeoutId = setTimeout(() => {
            searchFn(...args);
            timeoutId = null;
        }, debounceDelay);
    };

 
    debouncedFn.cancel = () => {
        if (timeoutId) {
            clearTimeout(timeoutId);
            timeoutId = null;
        }
    };

    return debouncedFn;
}


export function shouldSearch(
    query: string,
    config: Omit<SearchConfig, 'debounceDelay'> = {}
): boolean {
    const { minLength = 1, maxLength = 100, allowEmpty = false } = config;

    if (!allowEmpty && !query.trim()) {
        return false;
    }

    if (query.length < minLength) {
        return false;
    }

    if (query.length > maxLength) {
        return false;
    }

    return true;
}



export const toId = (id: number | string) => String(id);

export function mergeSearchResults(
    prevResults: Record<string, UserGitHubProfile>,
    prevOrder: string[],
    items: UserGitHubProfile[],
    isNewSearch: boolean
) {
    const results = isNewSearch ? {} : { ...prevResults };
    const order = isNewSearch ? [] : [...prevOrder];

    for (const user of items) {
        const id = toId(user.id);
        if (!results[id]) order.push(id);
        results[id] = user;
    }

    return { results, order };
}

export function deleteSelected(
    results: Record<string, UserGitHubProfile>,
    order: string[],
    selected: Record<string, boolean>
) {
    const selectedIds = new Set(Object.keys(selected));
    if (selectedIds.size === 0) return { results, order };

    const nextResults = { ...results };
    selectedIds.forEach(id => delete nextResults[id]);

    const nextOrder = order.filter(id => !selectedIds.has(id));
    return { results: nextResults, order: nextOrder };
}

export function duplicateSelectedInOrder(
    results: Record<string, UserGitHubProfile>,
    order: string[],
    selected: Record<string, boolean>
) {
    const selectedIds = new Set(Object.keys(selected));
    if (selectedIds.size === 0) return { results, order };

    const nextResults = { ...results };
    const nextOrder: string[] = [];

    for (const id of order) {
        nextOrder.push(id);

        if (!selectedIds.has(id)) continue;

        const original = nextResults[id];
        if (!original || original.isDuplicate) continue;

        const duplicateId = `${id}_copy`;
        if (nextResults[duplicateId]) continue;

        nextResults[duplicateId] = {
            ...original,
            id: duplicateId,
            isDuplicate: true,
            originalId: original.originalId ?? (typeof original.id === "number" ? original.id : undefined),
        };

        nextOrder.push(duplicateId);
    }

    return { results: nextResults, order: nextOrder };
}

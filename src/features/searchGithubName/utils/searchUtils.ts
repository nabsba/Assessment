
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
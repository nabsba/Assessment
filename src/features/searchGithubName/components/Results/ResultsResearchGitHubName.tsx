import { useCallback, useMemo } from 'react';
import { ErrorType } from '../../../error/components/ErrorComponent';
import { LoaderType } from '../../../loader/components/Loader';
import DataFetchingWrapper from '../../../shared/components/DataFetchingWrapper';
import { IntersectionObserverWrapper } from '../../../shared/components/observer/IntersectionObserver';
import { useSearchContext } from '../../hooks/gitHubContext/GitHubContext';
import ListCard from '../listCards/ListCards';
import content from '../../data/content.json';

export default function ResultsResearchGitHubName() {
    const { state, searchUsers, showNotification } = useSearchContext();

    const hasResults = !!state.results && Object.keys(state.results).length > 0;
    const loadingMode = !hasResults ? 'replace' : 'append';

    const handleEndReached = useCallback(() => {
        const { query, pagination, loading, apiLimitations } = state;

        if (apiLimitations.remaining === 0) {
            showNotification(content.searchInput.notifications.rateLimitExceeded, 6000);
            return;
        }

        if (apiLimitations.remaining && apiLimitations.remaining <= 2) {
            showNotification(content.searchInput.notifications.rateLimitWarning);
        }

        if (!query || !pagination.hasNextPage || loading) return;

        searchUsers(query, pagination.currentPage + 1);
    }, [state, searchUsers, showNotification]);

    const observerEnabled = useMemo(() => {
        const resultsCount = state.resultsOrder?.length ?? 0;
        return resultsCount > 0 && !!state.query && !!state.pagination?.hasNextPage && !state.loading;
    }, [state.resultsOrder?.length, state.query, state.pagination?.hasNextPage, state.loading]);

    return (
        <DataFetchingWrapper
            isLoading={state.loading}
            isError={!!state.error}
            errorProps={{ type: ErrorType.SERVER }}
            loaderProps={{ type: LoaderType.CARDS }}
            loadingMode={loadingMode}
            appendLoaderProps={{ type: LoaderType.CARDS }}
        >
            <>
                <ListCard />
                <IntersectionObserverWrapper
                    onVisible={handleEndReached}
                    enabled={observerEnabled}
                    options={{ root: null, rootMargin: '100px', threshold: 0.1 }}
                >
                    <div style={{ height: 1 }} />
                </IntersectionObserverWrapper>
            </>
        </DataFetchingWrapper>
    );
}

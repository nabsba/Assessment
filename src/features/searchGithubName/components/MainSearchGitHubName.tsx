
import Header from './header/Header'
import ListCards from './listCards/ListCards'
import Menus from './menus/Menus'
import styles from './mainSearch.module.css';
import { ErrorType } from '../../error/components/ErrorComponent'
import { LoaderType } from '../../loader/components/Loader'
import DataFetchingWrapper from '../../shared/components/DataFetchingWrapper'
import { useSearchContext } from '../hooks/GitHubContext'
import GitHubSearch from './GitHubSearchInput/GitHubSearchInput'
import { useState, useEffect } from 'react'
import type { ContentConfig } from '../types/content.types'
import content from '../data/content.json'

export default function MainSearchGitHubName() {
  const { state } = useSearchContext();
  const [isFirstVisit, setIsFirstVisit] = useState(true);
  const hasResults = state.results && Object.keys(state.results).length > 0;
  const loadingMode = !hasResults ? 'replace' : 'append';

  const { mainListCard } = content as ContentConfig;

  useEffect(() => {
    if (state.results && Object.keys(state.results).length > 0) {
      setIsFirstVisit(false);
    }
  }, [state.results]);

  return (
    <>
      <div className={styles.fixedHeader}>
        <Header />
      </div>

      <div className={styles.mainContainer}>
        <div className={styles.stickySection}>
          <div className={`flex-center ${styles.searchContainer}`}>
            <GitHubSearch />
          </div>
          <div className={styles.menusContainer}>
            <Menus />
          </div>
        </div>

        <div className={styles.scrollableContent}>
          {!hasResults ? (
            <div className={styles.emptyContainer}>
              <p>{isFirstVisit ? mainListCard.startState : mainListCard.emptyState}</p>
            </div>
          ) : (
            <DataFetchingWrapper
              isLoading={state.loading}
              isError={!!state.error}
              errorProps={{ type: ErrorType.SERVER }}
              loaderProps={{ type: LoaderType.CARDS }}
              loadingMode={loadingMode}
              appendLoaderProps={{ type: LoaderType.CARDS }}
            >
              <ListCards />
            </DataFetchingWrapper>
          )}
        </div>
      </div>
    </>
  )
}
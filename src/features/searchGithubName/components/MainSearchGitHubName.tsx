
import { ErrorType } from '../../error/components/ErrorComponent';
import { LoaderType } from '../../loader/components/Loader';
import DataFetchingWrapper from '../../shared/components/DataFetchingWrapper';
import { useSearchContext } from '../hooks/gitHubContext/GitHubContext';
import GitHubSearch from './GitHubSearchInput/GitHubSearchInput';
import Header from './header/Header';
import ListCards from './listCards/ListCards';
import styles from './mainSearch.module.css';
import Menus from './menus/Menus';
import WelcomeMessage from './WelcomeMessage/WelcomeMessage';

export default function MainSearchGitHubName() {
  const { state } = useSearchContext();

  const hasResults = state.results && Object.keys(state.results).length > 0;
  const loadingMode = !hasResults ? 'replace' : 'append';




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
          {!hasResults && !state.loading ? (
            <WelcomeMessage/>
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
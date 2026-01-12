import Header from './header/Header'
import ListCards from './listCards/ListCards'
import Menus from './menus/Menus'
import styles from './mainSearch.module.css';
import { ErrorType } from '../../error/components/ErrorComponent'
import { LoaderType } from '../../loader/components/Loader'
import DataFetchingWrapper from '../../shared/components/DataFetchingWrapper'
import { useSearchContext } from '../hooks/GitHubContext'
import GitHubSearch from './GitHubSearchInput/GitHubSearchInput'

export default function MainSearchGitHubName() {
  const { state } = useSearchContext();

  return (
    <>
      {/* Header fixed at top */}
      <div className={styles.fixedHeader}>
        <Header />
      </div>

      <div className={styles.mainContainer}>
        {/* Search and menus - sticky below header */}
        <div className={styles.stickySection}>
          <div className={`flex-center ${styles.searchContainer}`}>
            <GitHubSearch />
          </div>
          <div className={styles.menusContainer}>
            <Menus />
          </div>
        </div>

        {/* Scrollable content area */}
        <div className={styles.scrollableContent}>
          <DataFetchingWrapper
            isLoading={state.loading}
            isError={!!state.error}
            errorProps={{ type: ErrorType.SERVER }}
            loaderProps={{ type: LoaderType.DOTS }}
          >
            <ListCards />
          </DataFetchingWrapper>
        </div>
      </div>
    </>
  )
}
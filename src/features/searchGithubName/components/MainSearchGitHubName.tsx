
import { useSearchContext } from '../hooks/gitHubContext/GitHubContext';
import GitHubSearch from './GitHubSearchInput/GitHubSearchInput';
import Header from './header/Header';
import styles from './mainSearch.module.css';
import Menus from './menus/Menus';
import ResultsResearchGitHubName from './Results/ResultsResearchGitHubName';
import WelcomeMessage from './WelcomeMessage/WelcomeMessage';

export default function MainSearchGitHubName() {
  const { state } = useSearchContext();

  const hasResults = state.results && Object.keys(state.results).length > 0;





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
            <ResultsResearchGitHubName />
          )}
        </div>
      </div>
    </>
  )
}
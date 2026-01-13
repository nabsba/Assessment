
import GitHubSearch from './GitHubSearchInput/GitHubSearchInput';
import Header from './header/Header';
import styles from './mainSearch.module.css';
import Menus from './menus/Menus';
import ResultsResearchGitHubName from './Results/ResultsResearchGitHubName';
import WelcomeMessage from './WelcomeMessage/WelcomeMessage';

export default function MainSearchGitHubName() {


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
        <WelcomeMessage />
        <div className={styles.scrollableContent}>
            <ResultsResearchGitHubName />
        </div>
      </div>
    </>
  )
}
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
      <Header />
      <div className={styles.mainContainer}> 
      <DataFetchingWrapper isLoading={state.loading} isError={!!state.error} errorProps={{ type: ErrorType.SERVER }} loaderProps={{ type: LoaderType.DOTS }} >
        <div className={`flex-center ${styles.searchContainer}`}>
          <GitHubSearch />
        </div>
        <div className={styles.menusContainer}> <Menus /></div>
        <ListCards />
      </DataFetchingWrapper>
      </div>
    </>
  )
}

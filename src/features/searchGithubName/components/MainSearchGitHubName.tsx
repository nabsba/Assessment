import Header from './header/Header'
import ListCards from './listCards/ListCards'
import Menus from './menus/Menus'

import { ErrorType } from '../../error/components/ErrorComponent'
import { LoaderType } from '../../loader/components/Loader'
import DataFetchingWrapper from '../../shared/components/DataFetchingWrapper'
import { useSearchContext } from '../hooks/GitHubContext'
import GitHubSearch from './GitHubSearchInput/GitHubSearchInput'
export default function MainSearchGitHubName() {


  const { state } = useSearchContext();

  return (
    <div>
      <Header />
      <DataFetchingWrapper isLoading={state.loading} isError={!!state.error} errorProps={{ type: ErrorType.SERVER }} loaderProps={{ type: LoaderType.DOTS }} >
        <div className="flex-center">
          <GitHubSearch />
        </div>
        <Menus />
        <ListCards />
      </DataFetchingWrapper>
    </div>
  )
}

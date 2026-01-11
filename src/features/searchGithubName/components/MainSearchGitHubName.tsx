import SearchInput from '../../form/components/SearchInput'
import content from '../data/content.json'
import Header from './header/Header'
import MainListCard from './listCards/MainListCard'
import Menus from './menus/Menus'

import type { ContentConfig } from '../types/content.types';
export default function MainSearchGitHubName() {

  const {  searchInput } = content as ContentConfig;
  return (
    <div>
          <Header />
      <div className="flex-center">
          <SearchInput value={""} onChange={function (value: string): void {
       console.log('jhi')
        } } className='main-search-GitHubName'  placeholder={searchInput.placeholder}  /></div>
          <Menus />
          <MainListCard /> 
    </div>
  )
}

import SearchInput from "../../form/components/SearchInput";
import Header from "./header/Header";

import MainListCard from "./listCards/MainListCard";
import Menus from "./Menus";

export default function MainSearchGitHubName() {
  return (
    <div>
          <Header />
          <SearchInput />
          <Menus />
          <MainListCard /> 
    </div>
  )
}

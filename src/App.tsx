import './App.css'
import MainSearchGitHubName from './features/searchGithubName/components/MainSearchGitHubName'
import { EditModeProvider } from './features/searchGithubName/hooks/EditContext'
import { SearchProvider } from './features/searchGithubName/hooks/GitHubContext'


function App() {


  return (
    <>
      <SearchProvider>
        <EditModeProvider>
        <MainSearchGitHubName />
        </EditModeProvider>
      </SearchProvider>
    </>
  )
}

export default App

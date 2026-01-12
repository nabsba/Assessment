import './App.css'
import MainSearchGitHubName from './features/searchGithubName/components/MainSearchGitHubName'
import { SearchProvider } from './features/searchGithubName/hooks/GitHubContext'


function App() {


  return (
    <>
      <SearchProvider>
        <MainSearchGitHubName />
      </SearchProvider>
    </>
  )
}

export default App

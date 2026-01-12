import content from '../../data/content.json'
import Card from './Card'
import styles from './MainListCard.module.css'
import type { ContentConfig } from '../../types/content.types'
import { useSearchContext, type UserGitHubProfile } from '../../hooks/GitHubContext'
import { useMemo } from 'react'



export default function ListCard() {
  const { card } = content as ContentConfig;
  const { state, toggleUserSelection } = useSearchContext();
  
state.selectedUsers
  const handleViewProfile = (userId: number) => {
    console.log(`View profile for user ${userId}`);
  };

  const resultsArray = useMemo(() => {
    return state.results
      ? Object.values(state.results)
      : [];
  }, [state.results]);

  if (!state.results || resultsArray.length === 0) {
    return (
      <div className={styles.container}>
        <p>No users found. Try a different search.</p>
      </div>
    );
  }

  return (
    <div className={styles.container}>
      <div className={styles.cardGrid}>
        {resultsArray.map((user: UserGitHubProfile) => (
          <Card
            key={user.id}
            userId={user.id}
            username={user.login}
            avatarSrc={user.avatar_url}
            isSelected={Boolean(state.selectedUsers[user.id])}
            onSelect={() => toggleUserSelection(user.id)}
            onButtonClick={() => handleViewProfile(user.id)}
            buttonText={card.button.text}
            className={styles.cardWrapper}
          />
        ))}
      </div>
    </div>
  )
}
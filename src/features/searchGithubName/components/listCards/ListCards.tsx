import content from '../../data/content.json'
import Card from './Card'
import styles from './MainListCard.module.css'
import type { ContentConfig } from '../../types/content.types'
import { useSearchContext, type UserGitHubProfile } from '../../hooks/GitHubContext'



export default function ListCard() {
  const { card } = content as ContentConfig;
  const { state } = useSearchContext();
  

  const handleSelectUser = (userId: number, selected: boolean) => {
    console.log(`User ${userId} selected: ${selected}`);
  };

  const handleViewProfile = (userId: number) => {
    console.log(`View profile for user ${userId}`);
  };
  if (!state.results || !Array.isArray(state.results) || state.results.length === 0) {
    return (
      <div className={styles.container}>
        <p>No users found. Try a different search.</p>
      </div>
    );
  }

  return (
    <div className={styles.container}>
      <div className={styles.cardGrid}>
        {state.results.map((user: UserGitHubProfile) => (
          <Card
            key={user.id}
            userId={user.id}
            username={user.login}
            avatarSrc={user.avatar_url}
            isSelected={false}  
            onSelect={(selected) => handleSelectUser(user.id, selected)}
            onButtonClick={() => handleViewProfile(user.id)}
            buttonText={card.button.text}
            className={styles.cardWrapper}
          />
        ))}
      </div>
    </div>
  )
}
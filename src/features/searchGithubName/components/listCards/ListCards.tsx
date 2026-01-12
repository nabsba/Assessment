import content from '../../data/content.json'
import Card from './Card'
import styles from './MainListCard.module.css'
import type { ContentConfig } from '../../types/content.types'
import { useSearchContext, type UserGitHubProfile } from '../../hooks/GitHubContext'
import { useMemo } from 'react'

export default function ListCard() {
  const { card, mainListCard } = content as ContentConfig;
  const { state } = useSearchContext();

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
        <p>{mainListCard.emptyState}</p>
      </div>
    );
  }

  return (

      <div className={styles.cardGrid}>
        {resultsArray.map((user: UserGitHubProfile) => (
          <Card
            key={user.id}
            user={user}
            onButtonClick={handleViewProfile}
            buttonText={card.button.text}
            className={styles.cardWrapper}
          />
        ))}
      </div>

  )
}
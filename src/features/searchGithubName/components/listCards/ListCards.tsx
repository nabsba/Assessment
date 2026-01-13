// ListCards.tsx
import content from '../../data/content.json'
import { useSearchContext } from '../../hooks/gitHubContext/GitHubContext'
import type { ContentConfig } from '../../types/content.types'
import Card from './Card'
import styles from './MainListCard.module.css'

export default function ListCard() {
  const { card } = content as ContentConfig
  const { state } = useSearchContext()

  const resultsArray = state.resultsOrder || []

  return (
    <div className={styles.container}>
      <div className={styles.cardGrid}>
        {resultsArray.map((userId: number | string) => {
          const user = state.results?.[String(userId)]
          if (!user) return null

          return (
            <div
              key={String(userId)}
              className={styles.cardWrapper}
            >
              <Card
                user={user}
                onButtonClick={() => console.log('not implemented')}
                buttonText={card.button.text}
              />
            </div>
          )
        })}
      </div>
    </div>
  )
}

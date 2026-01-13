import { useCallback, useEffect, useRef, useState } from 'react'
import content from '../../data/content.json'
import { useSearchContext } from '../../hooks/GitHubContext'
import type { ContentConfig } from '../../types/content.types'
import Card from './Card'
import styles from './MainListCard.module.css'

export default function ListCard() {
  const { card, mainListCard } = content as ContentConfig;
  const { state, searchUsers } = useSearchContext();
  const [isFirstVisit, setIsFirstVisit] = useState(true);

  const lastCardRef = useRef<HTMLDivElement>(null);
  const observerRef = useRef<IntersectionObserver | null>(null);

  const resultsArray = state.resultsOrder || []; // ids

  const handleEndReached = useCallback(() => {
    const { query, pagination, loading } = state;
    if (!query || !pagination.hasNextPage || loading) return;

    searchUsers(query, pagination.currentPage + 1);
  }, [state, searchUsers]);

  useEffect(() => {
    if (!lastCardRef.current || resultsArray.length === 0) return;

    observerRef.current?.disconnect();

    observerRef.current = new IntersectionObserver(
      (entries) => {
        if (entries[0]?.isIntersecting) handleEndReached();
      },
      { root: null, rootMargin: '100px', threshold: 0.1 }
    );

    observerRef.current.observe(lastCardRef.current);

    return () => observerRef.current?.disconnect();
  }, [resultsArray.length, handleEndReached]);

  useEffect(() => {
    if (state.results && Object.keys(state.results).length > 0) {
      setIsFirstVisit(false);
    }
  }, [state.results]);

  if (!state.results || resultsArray.length === 0) {
    return (
      <div className={styles.container}>
        <p>{isFirstVisit ? mainListCard.startState : mainListCard.emptyState}</p>
      </div>
    );
  }

  return (
    <div className={styles.container}>
      <div className={styles.cardGrid}>
        {resultsArray.map((userId: number | string, index) => {
          const isLastCard = index === resultsArray.length - 1;

          const user = state.results?.[String(userId)];
          if (!user) return null; 

          return (
            <div
              key={String(userId)}
              ref={isLastCard ? lastCardRef : null}
              className={styles.cardWrapper}
              data-is-last={isLastCard}
            >
              <Card
                user={user}
                onButtonClick={() => console.log('not implemented')}
                buttonText={card.button.text}
              />
            </div>
          );
        })}
      </div>
    </div>
  );
}

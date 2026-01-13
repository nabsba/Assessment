// ListCards.tsx
import { useCallback, useEffect, useRef } from 'react'
import content from '../../data/content.json'
import { useSearchContext } from '../../hooks/gitHubContext/GitHubContext'
import type { ContentConfig } from '../../types/content.types'
import Card from './Card'
import styles from './MainListCard.module.css'

export default function ListCard() {
  const { card } = content as ContentConfig;
  const { state, searchUsers, showNotification } = useSearchContext();

  const lastCardRef = useRef<HTMLDivElement>(null);
  const observerRef = useRef<IntersectionObserver | null>(null);

  const resultsArray = state.resultsOrder || [];

  const handleEndReached = useCallback(() => {
    const { query, pagination, loading, apiLimitations } = state;

    if (apiLimitations.remaining === 0) {
      showNotification(content.searchInput.notifications.rateLimitExceeded, 6000);
      return;
    }

    if (state.apiLimitations.remaining && state.apiLimitations.remaining <= 2) {
      showNotification(content.searchInput.notifications.rateLimitWarning);
    }

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
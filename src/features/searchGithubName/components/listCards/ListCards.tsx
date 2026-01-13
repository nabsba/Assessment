import content from '../../data/content.json'
import Card from './Card'
import styles from './MainListCard.module.css'
import type { ContentConfig } from '../../types/content.types'
import { useSearchContext, type UserGitHubProfile } from '../../hooks/GitHubContext'
import { useEffect, useMemo, useState, useCallback, useRef } from 'react'

export default function ListCard() {
  const { card, mainListCard } = content as ContentConfig;
  const { state } = useSearchContext();
  const [isFirstVisit, setIsFirstVisit] = useState(true);


  const lastCardRef = useRef<HTMLDivElement>(null);
  const observerRef = useRef<IntersectionObserver | null>(null);
  const resultsArray = useMemo(() => {
    return state.results
      ? Object.values(state.results)
      : [];
  }, [state.results]);

  const handleEndReached = useCallback(() => {
    console.log('📜 End of list reached!');
    console.log('Triggering load more function...');

  }, []);

  useEffect(() => {
    if (!lastCardRef.current || resultsArray.length === 0) return;


    if (observerRef.current) {
      observerRef.current.disconnect();
    }


    observerRef.current = new IntersectionObserver(
      (entries) => {
        const [entry] = entries;
        if (entry.isIntersecting) {
          console.log('🎯 Dernière carte visible!');
          console.log('🔄 Déclenchement de handleEndReached...');
          handleEndReached();
        }
      },
      {
        root: null, 
        rootMargin: '100px', 
        threshold: 0.1 
      }
    );


    observerRef.current.observe(lastCardRef.current);


    return () => {
      if (observerRef.current) {
        observerRef.current.disconnect();
      }
    };
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
        {resultsArray.map((user: UserGitHubProfile, index) => {
          const isLastCard = index === resultsArray.length - 1;

          return (
            <div
              key={user.id}
              ref={isLastCard ? lastCardRef : null}
              className={styles.cardWrapper}
              data-is-last={isLastCard}
            >
              <Card
                user={user}
                onButtonClick={() =>console.log('not imlemented')}
                buttonText={card.button.text}
              />

         
            </div>
          );
        })}
      </div>


      {state.loading && (
        <div className={styles.loadingIndicator}>
          <div className={styles.spinner}></div>
          <p>Loading more users...</p>
        </div>
      )}
    </div>
  );
}
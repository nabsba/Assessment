import styles from './welcome.module.css'
import type { ContentConfig } from '../../types/content.types'
import content from '../../data/content.json'
import { useEffect, useState } from 'react';
import { useSearchContext } from '../../hooks/gitHubContext/GitHubContext';
export default function WelcomeMessage() {
    const { state } = useSearchContext();
    const [isFirstVisit, setIsFirstVisit] = useState(true);
    const { mainListCard } = content as ContentConfig;
    useEffect(() => {
        if (state.results && Object.keys(state.results).length > 0) {
            setIsFirstVisit(false);
        }
    }, [state.results]);
    return (
        <div className={styles.emptyContainer}>
            <p>{isFirstVisit ? mainListCard.startState : mainListCard.emptyState}</p>
        </div>
    )
}

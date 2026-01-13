import { useEffect, useState } from 'react';
import content from '../../data/content.json';
import { useSearchContext } from '../../hooks/gitHubContext/GitHubContext';
import type { ContentConfig } from '../../types/content.types';
import styles from './welcome.module.css';
export default function WelcomeMessage() {
    const { state } = useSearchContext();
    const [isFirstVisit, setIsFirstVisit] = useState(true);
    const { mainListCard } = content as ContentConfig;


    useEffect(() => {
        if (state.results && Object.keys(state.results).length > 0) {
            setIsFirstVisit(false);
        }
    }, [state.results]);

    if (!isFirstVisit || state.loading) return null;
    return (
        <div className={styles.emptyContainer}>
            <p>{mainListCard.startState }</p>
        </div>
    )
}

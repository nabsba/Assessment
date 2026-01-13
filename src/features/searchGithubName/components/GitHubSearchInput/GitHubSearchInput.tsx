import React, { useState, useCallback, useRef } from 'react';
import { createDebouncedSearch } from '../../utils/searchUtils';
import { useSearchContext } from '../../hooks/gitHubContext/GitHubContext';
import SearchInput from '../../../form/components/SearchInput';
import type { ContentConfig } from '../../types/content.types';
import content from '../../data/content.json'
import FadeIn from '../../../shared/components/animations/fadeIn/FadeAnimation';
import styles from './GitHubSearchInput.module.css'

const GitHubSearch: React.FC = () => {
    const { searchUsers, abortSearch, state, showNotification } = useSearchContext();
    const [inputValue, setInputValue] = useState('');

    const { searchInput } = content as ContentConfig;
    const prevValueRef = useRef('');
    const debouncedSearchTyping = useRef(
        createDebouncedSearch(searchUsers, {
            debounceDelay: 1500,
            minLength: 3,
            maxLength: 50,
        })
    );

    const debouncedSearchDeleting = useRef(
        createDebouncedSearch(searchUsers, {
            debounceDelay: 3000,
            minLength: 3,
            maxLength: 50,
        })
    );
    const handleInputChange = useCallback((value: string) => {
        const isDeleting = value.length < prevValueRef.current.length;
        prevValueRef.current = value;
        setInputValue(value);

        if (state.query === value.trim()) {
            return;
        }
        abortSearch();
        debouncedSearchTyping.current.cancel?.();
        debouncedSearchDeleting.current.cancel?.();
        if (state.apiLimitations.remaining === 2) {
            showNotification(searchInput.notifications.rateLimitWarning);
        }
        if (state.apiLimitations.remaining === 0) {
            showNotification(searchInput.notifications.rateLimitExceeded, 6000);
            return;
        }
        if (isDeleting) {
            if (value.length >= 3) {
                debouncedSearchDeleting.current(value);
            }
        } else {
            if (value.length >= 3) {
                debouncedSearchTyping.current(value);
            }
        }
    }, [abortSearch, state.apiLimitations]);


    return (
        <div className={styles.searchWrapper}>
            <div className={styles.searchInputContainer}>
                <SearchInput
                    value={inputValue}
                    onChange={handleInputChange}
                    className='main-search-GitHubName'
                    placeholder={searchInput.placeholder}
                />
            </div>

            {state.notification && (
                <div className={styles.notificationWrapper}>
                    <FadeIn
                        direction="opacity-only"
                        opacityDuration={500}
                        duration={500}
                        opacityDelay={1400}
                        triggerOnView={true}
                    >
                        <p className={styles.notification}>
                            {state.notification}
                        </p>
                    </FadeIn>
                </div>
            )}
        </div>
    );
};

export default GitHubSearch;
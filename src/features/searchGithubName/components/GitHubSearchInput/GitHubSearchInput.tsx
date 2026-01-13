import React, { useState, useCallback, useRef } from 'react';
import { createDebouncedSearch } from '../../utils/searchUtils';
import { useSearchContext } from '../../hooks/GitHubContext';
import SearchInput from '../../../form/components/SearchInput';
import type { ContentConfig } from '../../types/content.types';
import content from '../../data/content.json'

const GitHubSearch: React.FC = () => {
    const { searchUsers, abortSearch } = useSearchContext();
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

        abortSearch();

        debouncedSearchTyping.current.cancel?.();
        debouncedSearchDeleting.current.cancel?.();

        if (isDeleting) {
            console.log('Deletion detected, length:', value.length);
            if (value.length >= 3) {
                debouncedSearchDeleting.current(value);
            }
        } else {
            if (value.length >= 3) {
                debouncedSearchTyping.current(value);
            }
        }
    }, [abortSearch]);


    return (

        <SearchInput
            value={inputValue}
            onChange={handleInputChange}
            className='main-search-GitHubName' placeholder={searchInput.placeholder}
        />

    );
};

export default GitHubSearch;
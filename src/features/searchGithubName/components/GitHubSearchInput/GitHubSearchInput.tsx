import React, { useState, useCallback, useRef } from 'react';
import { createDebouncedSearch } from '../../utils/searchUtils';
import { useSearchContext } from '../../hooks/GitHubContext';
import SearchInput from '../../../form/components/SearchInput';
import type { ContentConfig } from '../../types/content.types';
import content from '../../data/content.json'

const GitHubSearch: React.FC = () => {
    const { searchUsers, abortSearch } = useSearchContext();
    const [inputValue, setInputValue] = useState('');
  const {  searchInput } = content as ContentConfig;

    const debouncedSearchRef = useRef(
        createDebouncedSearch(searchUsers, {
            debounceDelay: 1500,
            minLength: 2,
            maxLength: 50,
        })    
    );

    const handleInputChange = useCallback((value: string) => {
        setInputValue(value);
        abortSearch();
        debouncedSearchRef.current(value);
    }, [abortSearch]);

    return (

            <SearchInput
                value={inputValue}
                onChange={handleInputChange}
                className='main-search-GitHubName'  placeholder={searchInput.placeholder}
            />
 
    );
};

export default GitHubSearch;
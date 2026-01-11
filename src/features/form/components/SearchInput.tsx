import React from 'react'

import type { SearchInputProps } from '../types';
import styles from './SearchInput.module.css';  // Import CS

const SearchInput: React.FC<SearchInputProps> = ({
  value,
  onChange,
  placeholder = 'Search...',
  disabled = false,
  className = '',
  style = {},
  onFocus,
  onBlur,
  onKeyDown,
  onKeyUp,
  type = 'text',
  autoFocus = false,
  maxLength,
  minLength,
  id,
  name,
  ariaLabel,
  'data-testid': testId = 'search-input',
}) => {
  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    onChange(event.target.value);
  };

  return (
    <input
      type={type}
      value={value}
      onChange={handleChange}
      placeholder={placeholder}
      disabled={disabled}

      onFocus={onFocus}
      onBlur={onBlur}
      onKeyDown={onKeyDown}
      onKeyUp={onKeyUp}

      autoFocus={autoFocus}
      maxLength={maxLength}
      minLength={minLength}


      id={id}
      name={name}
      aria-label={ariaLabel || placeholder}


      className={className ? styles[className] : 'search-input'}
      style={style}


      data-testid={testId}
    />
  );
};

export default SearchInput;
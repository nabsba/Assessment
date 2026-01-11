export interface SearchInputProps {

  value: string;
  onChange: (value: string) => void;


  placeholder?: string;
  disabled?: boolean;
  className?: string;
  style?: React.CSSProperties;


  onFocus?: () => void;
  onBlur?: () => void;
  onKeyDown?: (event: React.KeyboardEvent<HTMLInputElement>) => void;
  onKeyUp?: (event: React.KeyboardEvent<HTMLInputElement>) => void;


  type?: 'text' | 'search' | 'email';
  autoFocus?: boolean;
  maxLength?: number;
  minLength?: number;


  id?: string;
  name?: string;
  ariaLabel?: string;
  'data-testid'?: string;
}
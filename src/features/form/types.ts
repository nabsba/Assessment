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
export interface CheckboxCustomStyles {
  checkboxCustom?: React.CSSProperties;
  checkboxChecked?: React.CSSProperties;
  checkmark?: React.CSSProperties;
}

export interface CheckboxProps {
  /** Whether the checkbox is checked */
  checked: boolean;
  /** Callback when checkbox state changes */
  onChange: (checked: boolean) => void;
  /** Text label for the checkbox */
  text?: string;
  /** Disabled state */
  disabled?: boolean;
  /** Additional CSS classes */
  className?: string;
  /** Inline styles */
  style?: React.CSSProperties;
  /** Checkbox ID for label association */
  id?: string;
  /** Checkbox name for forms */
  name?: string;
  /** Tooltip text */
  tooltip?: string;
  /** Required state */
  required?: boolean;
  /** Test ID for testing */
  'data-testid'?: string;
  customStyles?: CheckboxCustomStyles
}
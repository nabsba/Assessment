import React from 'react'
import type { CheckboxProps } from '../types';
import styles from './Checkbox.module.css';

const Checkbox: React.FC<CheckboxProps> = ({
    checked,
    onChange,
    text,
    disabled = false,
    className = '',
    style = {},
    customStyles = {}, // Add customStyles prop
    id,
    name,
    tooltip,
    required = false,
    'data-testid': testId = 'checkbox',
}) => {
    const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        if (!disabled) {
            onChange(event.target.checked);
        }
    };

    const handleKeyDown = (event: React.KeyboardEvent) => {
        if (!disabled && (event.key === 'Enter' || event.key === ' ')) {
            event.preventDefault();
            onChange(!checked);
        }
    };

    // Generate unique ID if not provided (for label association)
    const checkboxId = id || `checkbox-${Math.random().toString(36).substr(2, 9)}`;

    // Merge custom styles based on checked state
    const checkboxCustomStyles = {
        ...customStyles?.checkboxCustom,
        ...(checked ? customStyles?.checkboxChecked : {})
    };

    return (
        <div
            className={`${styles.checkboxContainer || ''} ${className}`}
            style={style}
            title={tooltip}
        >
            <div className={styles.checkboxWrapper || ''}>
                <input
                    type="checkbox"
                    id={checkboxId}
                    name={name}
                    checked={checked}
                    onChange={handleChange}
                    disabled={disabled}
                    required={required}
                    className={styles.checkboxInput || ''}
                    data-testid={testId}
                    aria-checked={checked}
                    aria-disabled={disabled}
                />
                <span
                    className={styles.checkboxCustom || ''}
                    onClick={() => !disabled && onChange(!checked)}
                    onKeyDown={handleKeyDown}
                    tabIndex={0}
                    style={checkboxCustomStyles} // Apply custom styles here
                    aria-checked={checked}
                    aria-labelledby={text ? `${checkboxId}-label` : undefined}
                />
                {/* Add the checkmark with custom styles */}
                {checked && (
                    <span
                        className={styles.checkmark || ''}
                        style={customStyles?.checkmark}
                    />
                )}
            </div>

            {text && (
                <label
                    htmlFor={checkboxId}
                    className={styles.checkboxLabel || ''}
                    id={`${checkboxId}-label`}
                >
                    {text}
                    {required && <span className={styles.requiredIndicator || ''}>*</span>}
                </label>
            )}
        </div>
    );
};

export default Checkbox;
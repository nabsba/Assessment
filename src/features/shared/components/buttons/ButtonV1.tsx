import React from 'react'

import styles from './button.module.css'

interface ButtonV1Props {
    /** Button text */
    text: string;
    /** Click handler function */
    onClick: () => void;
    /** Additional CSS classes */
    className?: string;
    /** Disabled state */
    disabled?: boolean;
    /** Button type */
    type?: 'button' | 'submit' | 'reset';
}

const ButtonV1: React.FC<ButtonV1Props> = ({
    text,
    onClick,
    className = '',
    disabled = false,
    type = 'button',
}) => {
    return (
        <button
            type={type}
            onClick={onClick}
            disabled={disabled}
            className={`button-v1 ${styles[className] ? styles[className] : ''}`}
        >
            {text}
        </button>
    );
};

export default ButtonV1;
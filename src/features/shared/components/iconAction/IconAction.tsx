import React from 'react'

import styles from './icon.module.css'
import { ICON_MAP, ICON_SIZES } from '../../data/icons'

import type { IconActionProps } from '../../types';




export default function IconAction({
    icon,
    onClick,
    size = 'md',
    className = '',
    ariaLabel,
    disabled = false,
    tooltip,
    text
}: IconActionProps) {
    const IconComponent = ICON_MAP[icon];
    if (!IconComponent) {
        return null;
    }
    const isClickable = !!onClick && !disabled;

    const iconSize = ICON_SIZES[size];

    const handleClick = (e: React.MouseEvent) => {
        if (!disabled && onClick) {
            e.stopPropagation();
            onClick();
        }
    };

    // Handle aria-label for JSX content
    const getAriaLabel = () => {
        if (ariaLabel) return ariaLabel;
        if (typeof text === 'string') return text;
        return `Icon ${icon}`;
    };

    const button = (
        <button
            onClick={handleClick}
            style={{ fontSize: iconSize }}
            className={`
    ${styles.iconAction}
    ${isClickable ? styles.clickable : ""}
    ${disabled ? styles.disabled : ""}
    ${className}
  `}
            aria-label={getAriaLabel()}
            disabled={disabled}
            title={tooltip}
        >
            <IconComponent />
            {text && text}
        </button>
    );

    if (tooltip && !disabled) {
        return (
            <div >
                {button}
                <div >
                    {tooltip}
                </div>
            </div>
        );
    }

    return button;
}
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
        console.warn(`Icon "${icon}" not found in ICON_MAP`);
        return null;
    }

    const iconSize = ICON_SIZES[size];

    const handleClick = (e: React.MouseEvent) => {
        if (!disabled && onClick) {
            e.stopPropagation();
            onClick();
        }
    };

    // FIX: Add text as fallback for aria-label
    const buttonAriaLabel = ariaLabel || text || `Icon ${icon}`;

    const button = (
        <button
            onClick={handleClick}
            style={{ fontSize: iconSize }}
            className={`${styles.iconAction} ${className}`}
            aria-label={buttonAriaLabel}  // Use the computed aria-label
            disabled={disabled}
            title={tooltip}
        >
            <IconComponent />
            {text && <span>{text}</span>}
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
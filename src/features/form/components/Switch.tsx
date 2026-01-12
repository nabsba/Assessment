import React, { useState } from 'react';
import styles from './Switch.module.css';

interface SwitchProps {
    checked?: boolean;
    onChange?: (checked: boolean) => void;
    disabled?: boolean;
    label?: string;
    size?: 'small' | 'medium' | 'large';
    color?: string;
}

const Switch: React.FC<SwitchProps> = ({
    checked = false,
    onChange,
    disabled = false,
    label = '',
    size = 'medium',
}) => {
    const [isChecked, setIsChecked] = useState(checked);

    const handleToggle = () => {
        if (disabled) return;

        const newValue = !isChecked;
        setIsChecked(newValue);
        onChange?.(newValue);
    };

    // Calculate knob position based on size
    const getKnobPosition = () => {
        const knobWidth = {
            small: 16,
            medium: 24,
            large: 32
        }[size];

        const trackWidth = {
            small: 40,
            medium: 56,
            large: 72
        }[size];

        const trackPadding = 2; // Padding of the track
        const margin = 2; // Small margin from edges

        if (isChecked) {
            // Move to right side: track width - knob width - padding - margin
            return trackWidth - knobWidth - (trackPadding * 2) - margin;
        } else {
            // Stay on left side: padding + margin
            return trackPadding + margin;
        }
    };

    const containerClass = `${styles.container} ${disabled ? styles.disabled : ''}`;
    const trackClass = `${styles.track} ${styles[size]} ${disabled ? styles.disabledTrack : ''}`;
    const knobClass = `${styles.knob} ${styles[`knob_${size}`]}`;

    return (
        <div className={containerClass}>
            <button
                type="button"
                className={trackClass + " " +  (isChecked ? styles.checked : '')}
              
                onClick={handleToggle}
                disabled={disabled}
                role="switch"
                aria-checked={isChecked}
                aria-label={label || 'Toggle switch'}
            >
                <span
                    className={knobClass}
                    style={{
                        transform: `translateX(${getKnobPosition()}px)`,
                    }}
                />
            </button>
            {label && (
                <span className={styles.label}>
                    {label}
                </span>
            )}
        </div>
    );
};

export default Switch;
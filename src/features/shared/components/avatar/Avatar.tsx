import React from 'react'

import styles from './avatar.module.css'

interface AvatarProps {
    src?: string;
    alt?: string;
    text?: string;
    size?: number;
    className?: string;
}
const Avatar: React.FC<AvatarProps> = ({
    src,
    alt = 'Avatar',
    text = 'Avatar',
    className = '',
}) => {
    return (
        <div
            className={'flex-center ' + (styles[className] || className)}
        >
            {src ? (
                <img
                    src={src}
                    alt={alt}
                    style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                />
            ) : (
                <span>{text}</span>
            )}
        </div>
    );
};

export default Avatar;
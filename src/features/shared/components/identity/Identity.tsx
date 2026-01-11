import React from 'react'

import styles from './identity.module.css'

interface IdentityProps {
    id: string | number;
    login: string;
    className?: string;

}



const Identity: React.FC<IdentityProps> = ({ id, login, className }) => {
    return (
        <div className={`flex-col items-center ${className && styles[className] ? styles[className] : ''}`}>
            <span>{id}</span>
            <span>{login}</span>
        </div>
    );
};

export default Identity;
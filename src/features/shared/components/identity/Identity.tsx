import React from 'react'

import styles from './identity.module.css'

import type { IdentityProps } from '../../types';



const Identity: React.FC<IdentityProps> = ({ id, login }) => {
    return (
        <div className={`flex-col ${styles.identity ? styles.identity : ''}`}>
            <span>{id}</span>
            <span>{login}</span>
        </div>
    );
};

export default Identity;
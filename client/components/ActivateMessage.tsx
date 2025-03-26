import React from 'react';
import styles from "../styles/ActivateMessage.module.scss";

const ActivateMessage: React.FC = () => {
    return (
        <div className={styles.message}>
            <p style={{color: 'red'}}>Activate account to interact</p>
        </div>
    );
};

export default ActivateMessage;
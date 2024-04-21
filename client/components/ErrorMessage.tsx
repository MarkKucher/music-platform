import React from 'react';
import styles from '../styles/ErrorMessage.module.scss';

interface ErrorMessageProps {
    text: string;
}

const ErrorMessage: React.FC<ErrorMessageProps> = ({text}) => {
    return (
        <div className={styles.message}>
            {text}
        </div>
    );
};

export default ErrorMessage;
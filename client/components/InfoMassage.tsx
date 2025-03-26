import React from 'react';
import styles from "../styles/InfoMessage.module.scss";

interface InfoMessage {
    text: string;
}

const InfoMessage: React.FC<InfoMessage> = ({text}) => {
    return (
        <div className={styles.message}>
            {text}
        </div>
    );
};

export default InfoMessage;
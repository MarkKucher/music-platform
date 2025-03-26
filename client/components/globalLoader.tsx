import React from 'react';
import styles from "../styles/GlobalLoader.module.scss";

const GlobalLoader = () => {
    return (
        <div className={styles.wrapper}>
            <div className={styles.loader}/>
        </div>
    );
};

export default GlobalLoader;
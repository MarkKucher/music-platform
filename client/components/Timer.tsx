import React from 'react';
import styles from '../styles/Timer.module.scss';

const Timer = (left: number, right: number) => {

    const getSec = (totalSec) => {
        return totalSec - Math.floor(totalSec / 60) * 60;
    }

    const getMin = (totalSec) => {
        return Math.floor(totalSec / 60)
    }

    return (
        <div>
            {left === null ? <p>Duration - {getMin(right)}:{getSec(right) < 10 && '0'}{getSec(right)}</p>
            :<div className={styles.timer}>
                {getMin(left)}:{getSec(left) < 10 && '0'}{getSec(left)} / {getMin(right)}:{getSec(right) < 10 && '0'}{getSec(right)}
            </div>}
        </div>
    );
};

export default Timer;
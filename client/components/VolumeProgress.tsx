import React, {useEffect, useState} from 'react';
import styles from "../styles/Progress.module.scss";

interface TrackProgressProps {
    left: number;
    right: number;
    onChange: (e) => void;
    className?: string;
}

const VolumeProgress: React.FC<TrackProgressProps> = ({left, right, onChange, className}) => {
    const [width, setWidth] = useState(window.innerWidth);

    let onResize = (e) => {
        setWidth(e.target.innerWidth)
    }

    useEffect(() => {
        window.addEventListener('resize', onResize, {passive: true})
        return () => {
            window.removeEventListener('resize', onResize)
        }
    }, [])

    return (
        <div className={styles.progress}>
            <input
                type="range"
                min={0}
                max={right}
                value={left}
                onChange={onChange}
                className={className}
            />
            {width > 700 && <div className={styles.info}>{left} / {right}</div>}
        </div>
    );
};

export default VolumeProgress;
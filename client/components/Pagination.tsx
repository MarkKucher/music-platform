import React from 'react';
import styles from '../styles/Pagination.module.scss'

interface PaginationProps {
    totalPages: number[];
    page: number;
    setPage: any;
}

const Pagination: React.FC<PaginationProps> = ({totalPages, page, setPage}) => {

    return (
        <div className={styles.page__wrapper}>
            {totalPages.map((p) =>
                p <= 10 &&
                    <span
                        onClick={() => setPage(p)}
                        key={p}
                        className={page === p ? `${styles.page} ${styles.page__current}` : styles.page}
                    >
                        {p}
                    </span>
            )}
            {totalPages.length > 10 &&
                <span className={styles.page}>
                    ...
                </span>
            }
        </div>
    );
};

export default Pagination;
import React, { useMemo } from 'react';
import { Link, useLocation } from 'react-router-dom';
import qs from 'qs';
import ArrowRightIcon from 'components/icons/ArrowRightIcon';
import styles from './Pagination.module.scss';

export type PaginationProps = {
    productsPerPage: number;
    totalProducts: number;
    paginate: (value: number) => void;
    currentPage: number;
    maxVisiblePages?: number;
};

const Pagination: React.FC<PaginationProps> = ({
    productsPerPage,
    totalProducts,
    paginate,
    currentPage,
    maxVisiblePages = 4
}) => {
    const location = useLocation();
    const totalPages = Math.ceil(totalProducts / productsPerPage);

    const generatePageUrl = (pageNumber: number) => {
        const queryParams = qs.parse(location.search, { ignoreQueryPrefix: true });
        queryParams.page = pageNumber > 1 ? pageNumber.toString() : undefined;
        const newSearch = qs.stringify(queryParams, { skipNulls: true });
        return `${location.pathname}?${newSearch}`;
    };

    const pageNumbers = useMemo(() => {
        if (totalPages <= 1) return [];

        const numbers: Array<number | null> = [];
        const halfVisible = Math.floor(maxVisiblePages / 2);

        let startPage = Math.max(1, currentPage - halfVisible);
        let endPage = Math.min(totalPages, startPage + maxVisiblePages - 1);

        if (endPage - startPage + 1 < maxVisiblePages) {
            startPage = Math.max(1, endPage - maxVisiblePages + 1);
        }

        if (startPage > 1) {
            numbers.push(1);
            if (startPage > 2) {
                numbers.push(null);
            }
        }

        for (let i = startPage; i <= endPage; i++) {
            numbers.push(i);
        }

        if (endPage < totalPages) {
            if (endPage < totalPages - 1) {
                numbers.push(null);
            }
            numbers.push(totalPages);
        }

        return numbers;
    }, [currentPage, totalPages, maxVisiblePages]);

    const handlePageClick = (pageNumber: number, event: React.MouseEvent) => {
        event.preventDefault();
        paginate(pageNumber);
    };

    const handlePreviousClick = (event: React.MouseEvent) => {
        event.preventDefault();
        if (currentPage > 1) {
            paginate(currentPage - 1);
        }
    };

    const handleNextClick = (event: React.MouseEvent) => {
        event.preventDefault();
        if (currentPage < totalPages) {
            paginate(currentPage + 1);
        }
    };

    if (totalPages <= 1) {
        return null;
    }

    const isPreviousDisabled = currentPage <= 1;
    const isNextDisabled = currentPage >= totalPages;

    return (
        <nav className={styles.pagination} aria-label="Product pagination">
            <ul className={styles.pagination__list}>
                <li className={styles.pagination__item}>
                    <Link
                        to={generatePageUrl(currentPage - 1)}
                        className={`${styles.pagination__link} ${['styles.pagination__nav-link']} ${isPreviousDisabled ? styles.pagination__disabled : ''}`}
                        onClick={handlePreviousClick}
                        aria-label="Go to previous page"
                        aria-disabled={isPreviousDisabled}
                        tabIndex={isPreviousDisabled ? -1 : undefined}
                    >
                        <ArrowRightIcon
                            className={`${styles['pagination__arrow']} ${styles['pagination__arrow-left']}`}
                            color={isPreviousDisabled ? 'secondary' : 'primary'}
                            width={44}
                            height={44}
                            viewBox="0 0 32 32"
                            aria-hidden="true"
                        />
                    </Link>
                </li>

                {pageNumbers.map((number, index) => {
                    if (number === null) {
                        return (
                            <li
                                className={`${styles.pagination__item} ${styles.pagination__ellipsis}`}
                                key={`ellipsis-${index}`}
                                aria-hidden="true"
                            >
                                <span className={styles.pagination__ellipsis}>…</span>
                            </li>
                        );
                    }

                    const isActive = number === currentPage;
                    return (
                        <li
                            className={`${styles.pagination__item} ${isActive ? styles.pagination__active : ''}`}
                            key={number}
                        >
                            <Link
                                to={generatePageUrl(number)}
                                className={styles.pagination__link}
                                onClick={(e) => handlePageClick(number, e)}
                                aria-label={`Go to page ${number}`}
                                aria-current={isActive ? 'page' : undefined}
                            >
                                {number}
                            </Link>
                        </li>
                    );
                })}

                <li className={styles.pagination__item}>
                    <Link
                        to={generatePageUrl(currentPage + 1)}
                        className={`${styles.pagination__link} ${styles['pagination__nav-link']} ${isNextDisabled ? styles.pagination__disabled : ''}`}
                        onClick={handleNextClick}
                        aria-label="Go to next page"
                        aria-disabled={isNextDisabled}
                        tabIndex={isNextDisabled ? -1 : undefined}
                    >
                        <ArrowRightIcon
                            className={styles.pagination__arrow}
                            color={isNextDisabled ? 'secondary' : 'primary'}
                            width={44}
                            height={44}
                            viewBox="0 0 32 32"
                            aria-hidden="true"
                        />
                    </Link>
                </li>
            </ul>
        </nav>
    );
};

export default Pagination;
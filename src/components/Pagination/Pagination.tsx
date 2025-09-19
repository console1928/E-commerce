import React, { useMemo } from 'react';
import { Link, useLocation } from 'react-router-dom';
import ArrowRightIcon from 'components/icons/ArrowRightIcon';
import classes from './Pagination.module.scss';

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
        <nav className={classes.pagination} aria-label="Product pagination">
            <ul className={classes.list}>
                <li className={classes.pageItem}>
                    <Link
                        to={location.pathname}
                        className={`${classes.pageLink} ${classes.navLink} ${isPreviousDisabled ? classes.disabled : ''}`}
                        onClick={handlePreviousClick}
                        aria-label="Go to previous page"
                        aria-disabled={isPreviousDisabled}
                        tabIndex={isPreviousDisabled ? -1 : undefined}
                    >
                        <ArrowRightIcon
                            className={classes.arrowLeft}
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
                                className={`${classes.pageItem} ${classes.ellipsisItem}`}
                                key={`ellipsis-${index}`}
                                aria-hidden="true"
                            >
                                <span className={classes.ellipsis}>…</span>
                            </li>
                        );
                    }

                    const isActive = number === currentPage;
                    return (
                        <li
                            className={`${classes.pageItem} ${isActive ? classes.active : ''}`}
                            key={number}
                        >
                            <Link
                                to={location.pathname}
                                className={classes.pageLink}
                                onClick={(e) => handlePageClick(number, e)}
                                aria-label={`Go to page ${number}`}
                                aria-current={isActive ? 'page' : undefined}
                            >
                                {number}
                            </Link>
                        </li>
                    );
                })}

                <li className={classes.pageItem}>
                    <Link
                        to={location.pathname}
                        className={`${classes.pageLink} ${classes.navLink} ${isNextDisabled ? classes.disabled : ''}`}
                        onClick={handleNextClick}
                        aria-label="Go to next page"
                        aria-disabled={isNextDisabled}
                        tabIndex={isNextDisabled ? -1 : undefined}
                    >
                        <ArrowRightIcon
                            className={classes.arrowRight}
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
import React from 'react';
import classNames from 'classnames';
import styles from './Loader.module.scss';

export type LoaderProps = {
    /** Размер */
    size?: 's' | 'm' | 'l';
    /** Дополнительный класс */
    className?: string;
};

const Loader: React.FC<LoaderProps> = ({ size = 'l', className = '' }) => {
    const loaderClass = classNames(
        styles.loader,
        {
            [styles['loader--s']]: size === 's',
            [styles['loader--m']]: size === 'm',
            [styles['loader--l']]: size === 'l',
        },
        className
    );

    const spinnerClass = classNames(
        styles.loader__spinner,
        {
            [styles['loader__spinner--button']]: className?.includes('button__loader'),
        }
    );

    return (
        <div className={loaderClass} role="status" aria-label="Загрузка">
            <div className={spinnerClass}></div>
        </div>
    );
};

export default Loader;
import React from 'react';
import Loader from 'components/Loader';
import styles from './Product.module.scss';

const ProductLoading: React.FC = () => {
    return (
        <div className={styles.load}>
            <Loader />
        </div>
    );
};

export default ProductLoading;
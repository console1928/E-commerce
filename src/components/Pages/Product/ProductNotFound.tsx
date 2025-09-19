import React from 'react';
import { Link } from 'react-router-dom';
import Text from 'components/Text';
import Button from 'components/Button';
import styles from './Product.module.scss';

const ProductNotFound: React.FC = () => {
    return (
        <div className={styles.notFound}>
            <Text view="title">Product not found</Text>
            <Link to="/">
                <Button>Go to Home</Button>
            </Link>
        </div>
    );
};

export default ProductNotFound;
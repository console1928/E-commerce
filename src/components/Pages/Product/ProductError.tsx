import React from 'react';
import Text from 'components/Text';
import Button from 'components/Button';
import styles from './Product.module.scss';

interface ProductErrorProps {
    error: string;
    onRetry: () => void;
}

const ProductError: React.FC<ProductErrorProps> = ({ error, onRetry }) => {
    return (
        <div className={styles.error}>
            <Text view="p-20" color="primary">
                {error}
            </Text>
            <Button onClick={onRetry}>Try Again</Button>
        </div>
    );
};

export default ProductError;
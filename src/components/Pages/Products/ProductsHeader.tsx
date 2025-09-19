import React from 'react';
import Text from 'components/Text';
import styles from './Products.module.scss';

interface ProductsHeaderProps { }

const ProductsHeader: React.FC<ProductsHeaderProps> = () => {
    return (
        <div className={styles.info}>
            <Text className={styles.title} color="primary" view="title">
                Products
            </Text>
            <Text className={styles.content} color="secondary" view="p-20">
                We display products based on the latest products we have, if you want<br />
                to see our old products please enter the name of the item
            </Text>
        </div>
    );
};

export default ProductsHeader;
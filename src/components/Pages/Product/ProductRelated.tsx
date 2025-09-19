import React from 'react';
import Text from 'components/Text';
import Card from 'components/Card';
import Button from 'components/Button';
import { RelatedProduct } from 'stores/product.store';
import styles from './Product.module.scss';

interface ProductRelatedProps {
    relatedItems: RelatedProduct[];
}

const ProductRelated: React.FC<ProductRelatedProps> = ({ relatedItems }) => {
    const getImageUrl = (image: any): string => {
        return image.formats?.large?.url || image.url || '/placeholder-image.jpg';
    };

    return (
        <div className={styles.relatedItem}>
            <Text className={styles.relatedItemText} view="title">
                Related Items
            </Text>
            <div className={styles.relatedItems}>
                {relatedItems.map((item) => (
                    <Card
                        url={`/product/${item.id}`}
                        className={styles.productItem}
                        key={item.id}
                        title={item.title}
                        image={getImageUrl(item.images[0])}
                        subtitle={item.description}
                        captionSlot={item.productCategory.title}
                        contentSlot={`$${item.price}`}
                        actionSlot={<Button>Add to cart</Button>}
                    />
                ))}
            </div>
        </div>
    );
};

export default ProductRelated;
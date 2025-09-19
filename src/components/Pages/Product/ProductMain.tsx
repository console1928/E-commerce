import React from 'react';
import Text from 'components/Text';
import Button from 'components/Button';
import { ProductType } from 'stores/products.store';
import styles from './Product.module.scss';

interface ProductMainProps {
    product: ProductType;
}

const ProductMain: React.FC<ProductMainProps> = ({ product }) => {
    const getImageUrl = (image: any): string => {
        return image.formats?.large?.url || image.url || '/placeholder-image.jpg';
    };

    const handleAddToCart = () => {
        // Логика добавления в корзину
    };

    const handleBuyNow = () => {
        // Логика покупки
    };

    return (
        <div className={styles.container}>
            <div className={styles.imageContainer}>
                <img
                    className={styles.image}
                    src={getImageUrl(product.images[0])}
                    alt={product.title}
                    loading="lazy"
                />
            </div>

            <div className={styles.content}>
                <div className={styles.contentText}>
                    <Text className={styles.contentTitle} view="title">
                        {product.title}
                    </Text>
                    <Text className={styles.contentSubtitle} view="p-20" color="secondary">
                        {product.description}
                    </Text>
                </div>

                <div className={styles.actionContainer}>
                    <span className={styles.price}>{`$${product.price}`}</span>
                    <div className={styles.btns}>
                        <Button className={styles.buyBtn} onClick={handleBuyNow}>
                            Buy Now
                        </Button>
                        <Button className={styles.addBtn} onClick={handleAddToCart}>
                            Add to Cart
                        </Button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ProductMain;
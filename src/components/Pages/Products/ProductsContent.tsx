import React from 'react';
import Card from 'components/Card';
import Button from 'components/Button';
import Text from 'components/Text';
import Pagination from 'components/Pagination';
import { ProductData } from 'stores/products.store';
import styles from './Products.module.scss';

interface ProductsContentProps {
    isLoading: boolean;
    error: string | null;
    filteredProducts: ProductData[];
    paginatedProducts: ProductData[];
    totalPages: number;
    searchValue: string;
    selectedFilters: any[];
    currentPage: number;
    onPageChange: (pageNumber: number) => void;
    onRetry: () => void;
}

const ProductsContent: React.FC<ProductsContentProps> = ({
    isLoading,
    error,
    filteredProducts,
    paginatedProducts,
    totalPages,
    searchValue,
    selectedFilters,
    currentPage,
    onPageChange,
    onRetry
}) => {
    const getImageUrl = (image: any): string => {
        return image.formats?.large?.url || image.url || '/placeholder-image.jpg';
    };

    if (isLoading) {
        return (
            <div className={styles.products}>
                <div className={styles.loading}>
                    <Text view="p-20" color="secondary">Loading products...</Text>
                </div>
            </div>
        );
    }

    if (error) {
        return (
            <div className={styles.products}>
                <div className={styles.error}>
                    <Text view="p-20" color="secondary">{error}</Text>
                    <Button onClick={onRetry}>Try Again</Button>
                </div>
            </div>
        );
    }

    if (filteredProducts.length === 0) {
        return (
            <div className={styles.products}>
                <div className={styles.noResults}>
                    <Text view="p-20" color="secondary">
                        {searchValue || selectedFilters.length > 0
                            ? 'No products found matching your criteria'
                            : 'No products available'
                        }
                    </Text>
                </div>
            </div>
        );
    }

    return (
        <div className={styles.products}>
            <div className={styles.total}>
                <Text view="p-20" weight="bold">
                    Total Products
                </Text>
                <Text view="p-20" weight="bold" color="accent">
                    {filteredProducts.length}
                </Text>
            </div>

            <div className={styles.items}>
                {paginatedProducts.map((product) => (
                    <Card
                        url={`/product/${product.id}`}
                        className={styles.item}
                        key={product.id}
                        title={product.title}
                        image={getImageUrl(product.images[0])}
                        subtitle={product.subTitle}
                        captionSlot={product.captionSlot}
                        contentSlot={`$${product.contentSlot}`}
                        actionSlot={<Button>Add to cart</Button>}
                    />
                ))}
            </div>

            {totalPages > 1 && (
                <div className={styles.pagination}>
                    <Pagination
                        productsPerPage={9}
                        totalProducts={filteredProducts.length}
                        paginate={onPageChange}
                        currentPage={currentPage}
                    />
                </div>
            )}
        </div>
    );
};

export default ProductsContent;
import { observer } from 'mobx-react-lite';
import { useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { productStore } from 'stores/product.store';
import ProductBackButton from './ProductBackButton';
import ProductMain from './ProductMain';
import ProductRelated from './ProductRelated';
import ProductLoading from './ProductLoading';
import ProductError from './ProductError';
import ProductNotFound from './ProductNotFound';

const Product = observer(() => {
    const { id } = useParams<{ id: string }>();
    const { product, relatedItems, loading, error, fetchProductData } = productStore;

    useEffect(() => {
        if (id) {
            fetchProductData(id);
        }
    }, [id, fetchProductData]);

    const handleRetry = () => {
        if (id) {
            fetchProductData(id);
        }
    };

    if (loading) {
        return <ProductLoading />;
    }

    if (error) {
        return <ProductError error={error} onRetry={handleRetry} />;
    }

    if (!product) {
        return <ProductNotFound />;
    }

    return (
        <div className="product-wrapper wrapper">
            <ProductBackButton />

            <div className="product-container">
                <ProductMain product={product} />

                {relatedItems.length > 0 && (
                    <ProductRelated relatedItems={relatedItems} />
                )}
            </div>
        </div>
    );
});

export default Product;
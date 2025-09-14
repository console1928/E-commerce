import { useEffect, useState, useCallback } from 'react';
import axios from 'axios';
import { Link, useParams } from 'react-router-dom';
import ArrowRightIcon from 'components/icons/ArrowRightIcon';
import Text from 'components/Text';
import Button from 'components/Button';
import Card from 'components/Card';
import Loader from 'components/Loader';
import { ProductType } from '../Products';
import classes from './Product.module.scss';

export type Filter = {
    category: { id: number };
};

type ProductData = {
    id: number;
    title: string;
    price: number;
    category: { name: string };
    description: string;
    images: string[];
};

const API_BASE_URL = 'https://api.escuelajs.co/api/v1';

const Product = () => {
    const { id } = useParams();
    const [product, setProduct] = useState<ProductType | null>(null);
    const [relatedItems, setRelatedItems] = useState<ProductData[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    const fetchProductData = useCallback(async () => {
        if (!id) return;

        try {
            setLoading(true);
            setError(null);

            const [productResponse, productsResponse] = await Promise.all([
                axios.get(`${API_BASE_URL}/products/${id}`),
                axios.get(`${API_BASE_URL}/products`),
            ]);

            const productData = productResponse.data;
            const allProducts = productsResponse.data;

            setProduct(productData);
            setRelatedItems(
                allProducts
                    .filter((item: Filter) => item.category.id === productData.category.id)
                    .slice(0, 3)
            );
        } catch (err) {
            setError('Failed to load product data');
            console.error('Error fetching product:', err);
        } finally {
            setLoading(false);
        }
    }, [id]);

    useEffect(() => {
        fetchProductData();
    }, [fetchProductData]);

    const handleAddToCart = () => { };

    const handleBuyNow = () => { };

    if (loading) {
        return (
            <div className={classes.load}>
                <Loader />
            </div>
        );
    }

    if (error) {
        return (
            <div className={classes.error}>
                <Text view="p-20" color="primary">
                    {error}
                </Text>
                <Button onClick={fetchProductData}>Try Again</Button>
            </div>
        );
    }

    if (!product) {
        return (
            <div className={classes.notFound}>
                <Text view="title">Product not found</Text>
                <Link to="/">
                    <Button>Go to Home</Button>
                </Link>
            </div>
        );
    }

    return (
        <div className={`${classes.productWrapper} wrapper`}>
            <Link to="/" className={classes.backLink}>
                <div className={classes.backBtn}>
                    <div className={classes.icon}>
                        <ArrowRightIcon
                            className={classes.backIcon}
                            width={32}
                            height={32}
                            viewBox="0 0 24 24"
                            color="primary"
                        />
                    </div>
                    <div className={classes.text}>Назад</div>
                </div>
            </Link>

            <div className={classes.productContainer}>
                <div className={classes.container}>
                    <div className={classes.imageContainer}>
                        <img
                            className={classes.image}
                            src={product.images[0]}
                            alt={product.title}
                            loading="lazy"
                        />
                    </div>

                    <div className={classes.content}>
                        <div className={classes.contentText}>
                            <Text className={classes.contentTitle} view="title">
                                {product.title}
                            </Text>
                            <Text className={classes.contentSubtitle} view="p-20" color="secondary">
                                {product.description}
                            </Text>
                        </div>

                        <div className={classes.actionContainer}>
                            <span className={classes.price}>{`$${product.price}`}</span>
                            <div className={classes.btns}>
                                <Button className={classes.buyBtn} onClick={handleBuyNow}>
                                    Buy Now
                                </Button>
                                <Button className={classes.addBtn} onClick={handleAddToCart}>
                                    Add to Cart
                                </Button>
                            </div>
                        </div>
                    </div>
                </div>

                {relatedItems.length > 0 && (
                    <div className={classes.relatedItem}>
                        <Text className={classes.relatedItemText} view="title">
                            Related Items
                        </Text>
                        <div className={classes.relatedItems}>
                            {relatedItems.map((item) => (
                                <Card
                                    url={`/product/${item.id}`}
                                    className={classes.productItem}
                                    key={item.id}
                                    title={item.title}
                                    image={item.images[0]}
                                    subtitle={item.description}
                                    captionSlot={item.category.name}
                                    contentSlot={`$${item.price}`}
                                    actionSlot={<Button>Add to cart</Button>}
                                />
                            ))}
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default Product;
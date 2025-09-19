import { useEffect, useState, useCallback } from 'react';
import axios from 'axios';
import { Link, useParams, useNavigate } from 'react-router-dom';
import ArrowRightIcon from 'components/icons/ArrowRightIcon';
import Text from 'components/Text';
import Button from 'components/Button';
import Card from 'components/Card';
import Loader from 'components/Loader';
import { ProductType, ProductImage } from '../Products';
import classes from './Product.module.scss';

export type ApiProductResponse = {
    data: ProductType;
};

export type ApiProductsResponse = {
    data: ProductType[];
};

export type RelatedProduct = {
    id: number;
    title: string;
    price: number;
    productCategory: { title: string };
    description: string;
    images: ProductImage[];
};

const API_BASE_URL = 'https://front-school-strapi.ktsdev.ru/api/products';

const Product = () => {
    const navigate = useNavigate();
    const { id } = useParams<{ id: string }>();
    const [product, setProduct] = useState<ProductType | null>(null);
    const [relatedItems, setRelatedItems] = useState<RelatedProduct[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    const fetchProductData = useCallback(async () => {
        if (!id) return;

        try {
            setLoading(true);
            setError(null);

            const [productResponse, productsResponse] = await Promise.all([
                axios.get<ApiProductResponse>(`${API_BASE_URL}/${id}?populate[0]=images&populate[1]=productCategory`),
                axios.get<ApiProductsResponse>(`${API_BASE_URL}?populate[0]=images&populate[1]=productCategory`),
            ]);

            const productData = productResponse.data.data;
            const allProducts = productsResponse.data.data;

            setProduct(productData);

            const related = allProducts
                .filter((item: ProductType) =>
                    item.productCategory?.title === productData.productCategory?.title &&
                    item.documentId !== productData.documentId
                )
                .slice(0, 3)
                .map((item: ProductType): RelatedProduct => ({
                    id: item.documentId,
                    title: item.title,
                    price: item.price,
                    productCategory: item.productCategory,
                    description: item.description,
                    images: item.images
                }));

            setRelatedItems(related);
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

    const getImageUrl = (image: ProductImage): string => {
        return image.formats?.large?.url || image.url || '/placeholder-image.jpg';
    };

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
            <div className={classes.backBtn} onClick={() => navigate(-1)}>
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

            <div className={classes.productContainer}>
                <div className={classes.container}>
                    <div className={classes.imageContainer}>
                        <img
                            className={classes.image}
                            src={getImageUrl(product.images[0])}
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
                                    image={getImageUrl(item.images[0])}
                                    subtitle={item.description}
                                    captionSlot={item.productCategory.title}
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
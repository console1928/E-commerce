import { observer } from 'mobx-react-lite';
import { useEffect } from 'react';
import { Link, useParams, useNavigate } from 'react-router-dom';
import ArrowRightIcon from 'components/icons/ArrowRightIcon';
import Text from 'components/Text';
import Button from 'components/Button';
import Card from 'components/Card';
import Loader from 'components/Loader';
import { productStore } from 'stores/product.store';
import classes from './Product.module.scss';

const Product = observer(() => {
    const navigate = useNavigate();
    const { id } = useParams<{ id: string }>();
    const { product, relatedItems, loading, error, fetchProductData } = productStore;

    useEffect(() => {
        if (id) {
            fetchProductData(id);
        }
    }, [id, fetchProductData]);

    const handleAddToCart = () => { };
    const handleBuyNow = () => { };

    const getImageUrl = (image: any): string => {
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
                <Button onClick={() => id && fetchProductData(id)}>Try Again</Button>
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
});

export default Product;
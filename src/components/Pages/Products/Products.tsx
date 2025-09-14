import { useState, useEffect, useMemo, useCallback } from 'react';
import axios from 'axios';
import Card from 'components/Card';
import Button from 'components/Button';
import Input from 'components/Input';
import Text from 'components/Text';
import MultiDropdown, { Option } from 'components/MultiDropdown';
import Pagination from 'components/Pagination';
import classes from './Products.module.scss';

export type ProductData = {
    id: number;
    title: string;
    contentSlot: number;
    subTitle: string;
    images: string[];
    captionSlot: string;
};

export type ProductType = {
    id: number;
    title: string;
    price: number;
    category: { name: string };
    description: string;
    images: string[];
};

export type FilterOption = Option & {
    category: string;
};

const PRODUCTS_PER_PAGE = 9;
const API_URL = 'https://api.escuelajs.co/api/v1/products';

function Products() {
    const [searchValue, setSearchValue] = useState<string>('');
    const [products, setProducts] = useState<ProductData[]>([]);
    const [filteredProducts, setFilteredProducts] = useState<ProductData[]>([]);
    const [currentPage, setCurrentPage] = useState<number>(1);
    const [isLoading, setIsLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);
    const [selectedFilters, setSelectedFilters] = useState<Option[]>([]);

    const categoryOptions = useMemo((): Option[] => {
        const categories = Array.from(new Set(products.map(product => product.captionSlot)));
        return categories.map(category => ({
            key: category,
            value: category,
        }));
    }, [products]);

    const filterProducts = useCallback(() => {
        let filtered = products;

        if (searchValue) {
            filtered = filtered.filter(product =>
                product.title.toLowerCase().includes(searchValue.toLowerCase()) ||
                product.subTitle.toLowerCase().includes(searchValue.toLowerCase())
            );
        }

        if (selectedFilters.length > 0) {
            const selectedCategories = selectedFilters.map(filter => filter.value);
            filtered = filtered.filter(product =>
                selectedCategories.includes(product.captionSlot)
            );
        }

        setFilteredProducts(filtered);
        setCurrentPage(1);
    }, [products, searchValue, selectedFilters]);

    useEffect(() => {
        const fetchProducts = async () => {
            try {
                setIsLoading(true);
                setError(null);

                const response = await axios.get<ProductType[]>(API_URL, {
                    timeout: 10000,
                });

                const formattedProducts: ProductData[] = response.data.map((raw: ProductType) => ({
                    id: raw.id,
                    title: raw.title,
                    contentSlot: raw.price,
                    captionSlot: raw.category.name,
                    images: raw.images.filter(img => img),
                    subTitle: raw.description,
                }));

                setProducts(formattedProducts);
                setFilteredProducts(formattedProducts);
            } catch (err) {
                setError(axios.isAxiosError(err)
                    ? `Failed to load products: ${err.message}`
                    : 'An unexpected error occurred'
                );
                console.error('Error fetching products:', err);
            } finally {
                setIsLoading(false);
            }
        };

        fetchProducts();
    }, []);

    useEffect(() => {
        filterProducts();
    }, [filterProducts]);

    const paginatedProducts = useMemo(() => {
        const lastIndex = currentPage * PRODUCTS_PER_PAGE;
        const firstIndex = lastIndex - PRODUCTS_PER_PAGE;
        return filteredProducts.slice(firstIndex, lastIndex);
    }, [filteredProducts, currentPage]);

    const totalPages = Math.ceil(filteredProducts.length / PRODUCTS_PER_PAGE);

    const handleSearchChange = (value: string) => {
        setSearchValue(value);
    };

    const handleFilterChange = (filters: Option[]) => {
        setSelectedFilters(filters);
    };

    const handlePageChange = (pageNumber: number) => {
        setCurrentPage(pageNumber);
        window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    const handleRetry = () => {
        window.location.reload();
    };

    const renderContent = () => {
        if (isLoading) {
            return (
                <div className={classes.loading}>
                    <Text view="p-20" color="secondary">Loading products...</Text>
                </div>
            );
        }

        if (error) {
            return (
                <div className={classes.error}>
                    <Text view="p-20" color="secondary">{error}</Text>
                    <Button onClick={handleRetry}>Try Again</Button>
                </div>
            );
        }

        if (filteredProducts.length === 0) {
            return (
                <div className={classes.noResults}>
                    <Text view="p-20" color="secondary">
                        {searchValue || selectedFilters.length > 0
                            ? 'No products found matching your criteria'
                            : 'No products available'
                        }
                    </Text>
                </div>
            );
        }

        return (
            <>
                <div className={classes.total}>
                    <Text view="p-20" weight="bold">
                        Total Products
                    </Text>
                    <Text view="p-20" weight="bold" color="accent">
                        {filteredProducts.length}
                    </Text>
                </div>

                <div className={classes.items}>
                    {paginatedProducts.map((product) => (
                        <Card
                            url={`/product/${product.id}`}
                            className={classes.item}
                            key={product.id}
                            title={product.title}
                            image={product.images[0] || '/placeholder-image.jpg'}
                            subtitle={product.subTitle}
                            captionSlot={product.captionSlot}
                            contentSlot={`$${product.contentSlot}`}
                            actionSlot={<Button>Add to cart</Button>}
                        />
                    ))}
                </div>

                {totalPages > 1 && (
                    <div className={classes.pagination}>
                        <Pagination
                            productsPerPage={PRODUCTS_PER_PAGE}
                            totalProducts={filteredProducts.length}
                            paginate={handlePageChange}
                            currentPage={currentPage}
                        />
                    </div>
                )}
            </>
        );
    };

    return (
        <div className={`${classes.productsWrapper} wrapper`}>
            <div className={classes.info}>
                <Text className={classes.title} color="primary" view="title">
                    Products
                </Text>
                <Text className={classes.content} color="secondary" view="p-20">
                    We display products based on the latest products we have, if you want<br />
                    to see our old products please enter the name of the item
                </Text>
            </div>

            <div className={classes.searchWrapper}>
                <div className={classes.search}>
                    <Input
                        value={searchValue}
                        onChange={handleSearchChange}
                        placeholder="Search Product"
                        disabled={isLoading}
                    />
                    <Button
                        className={classes.button}
                        loading={isLoading}
                        onClick={filterProducts}
                    >
                        Find Now
                    </Button>
                </div>

                <MultiDropdown
                    className={classes.dropDown}
                    value={selectedFilters}
                    getTitle={(filters) => filters.length > 0 ? `${filters.length} selected` : 'Filter'}
                    onChange={handleFilterChange}
                    options={categoryOptions}
                    disabled={isLoading || products.length === 0}
                />
            </div>

            <div className={classes.products}>
                {renderContent()}
            </div>
        </div>
    );
}

export default Products;
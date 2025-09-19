import { useState, useEffect, useMemo, useCallback } from 'react';
import axios from 'axios';
import { useLocation, useNavigate } from 'react-router-dom';
import qs from 'qs';
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
    images: ProductImage[];
    captionSlot: string;
    categoryId?: number;
};

export type ProductImage = {
    id?: number;
    url: string;
    formats?: {
        large?: {
            url: string;
        };
        medium?: {
            url: string;
        };
        small?: {
            url: string;
        };
        thumbnail?: {
            url: string;
        };
    };
};

export type ProductType = {
    documentId: number;
    title: string;
    price: number;
    productCategory: { id: number; title: string };
    description: string;
    images: ProductImage[];
};

export type ApiResponse = {
    data: ProductType[];
};

export type Category = {
    id: number;
    title: string;
};

export type CategoryOption = Option & {
    categoryId: number;
};

export type QueryParams = {
    search?: string;
    categories?: string;
    page?: string;
};

const PRODUCTS_PER_PAGE = 9;
const BASE_API_URL = 'https://front-school-strapi.ktsdev.ru/api/products';
const CATEGORIES_API_URL = 'https://front-school-strapi.ktsdev.ru/api/product-categories';

function Products() {
    const location = useLocation();
    const navigate = useNavigate();
    const [searchValue, setSearchValue] = useState<string>('');
    const [filteredProducts, setFilteredProducts] = useState<ProductData[]>([]);
    const [currentPage, setCurrentPage] = useState<number>(1);
    const [isLoading, setIsLoading] = useState<boolean>(true);
    const [isSearching, setIsSearching] = useState<boolean>(false);
    const [isFiltering, setIsFiltering] = useState<boolean>(false);
    const [error, setError] = useState<string | null>(null);
    const [selectedFilters, setSelectedFilters] = useState<CategoryOption[]>([]);
    const [categories, setCategories] = useState<Category[]>([]);

    useEffect(() => {
        const queryParams = qs.parse(location.search, { ignoreQueryPrefix: true }) as QueryParams;

        if (queryParams.search) {
            setSearchValue(queryParams.search);
        }

        if (queryParams.page) {
            setCurrentPage(Number(queryParams.page));
        }

        if (queryParams.categories && categories.length > 0) {
            const categoryIds = queryParams.categories.split(',').map(Number);
            const filters = categories
                .filter(cat => categoryIds.includes(cat.id))
                .map(cat => ({
                    key: cat.id.toString(),
                    value: cat.title,
                    categoryId: cat.id
                }));
            setSelectedFilters(filters);
        }
    }, [location.search, categories]);

    const updateQueryParams = useCallback((params: {
        search?: string;
        categories?: number[];
        page?: number;
    }) => {
        const queryParams = qs.parse(location.search, { ignoreQueryPrefix: true }) as QueryParams;

        if (params.search !== undefined) {
            queryParams.search = params.search || undefined;
        }

        if (params.categories !== undefined) {
            queryParams.categories = params.categories.length > 0
                ? params.categories.join(',')
                : undefined;
        }

        if (params.page !== undefined) {
            queryParams.page = params.page > 1 ? params.page.toString() : undefined;
        }

        const newSearch = qs.stringify(queryParams, { skipNulls: true });
        navigate(`${location.pathname}?${newSearch}`, { replace: true });
    }, [location, navigate]);

    const categoryOptions = useMemo((): CategoryOption[] => {
        return categories.map(category => ({
            key: category.id.toString(),
            value: category.title,
            categoryId: category.id
        }));
    }, [categories]);

    const fetchCategories = useCallback(async () => {
        try {
            const response = await axios.get(CATEGORIES_API_URL);
            const categoriesData = response.data.data.map((cat: any) => ({
                id: cat.id,
                title: cat.title || 'Unnamed Category'
            }));
            setCategories(categoriesData);
        } catch (err) {
            console.error('Error fetching categories:', err);
        }
    }, []);

    const fetchProducts = useCallback(async (searchTerm: string = '', categoryIds: number[] = []) => {
        try {
            setIsLoading(true);
            setError(null);

            let apiUrl = `${BASE_API_URL}?populate[0]=images&populate[1]=productCategory`;

            if (searchTerm.trim()) {
                apiUrl += `&filters[title][$containsi]=${encodeURIComponent(searchTerm)}`;
            }

            if (categoryIds.length > 0) {
                categoryIds.forEach((categoryId, index) => {
                    apiUrl += `&filters[productCategory][id][$in][${index}]=${categoryId}`;
                });
            }

            const response = await axios.get<ApiResponse>(apiUrl, {
                timeout: 10000,
            });

            const formattedProducts: ProductData[] = response.data.data.map((raw: ProductType) => ({
                id: raw.documentId,
                title: raw.title,
                contentSlot: raw.price,
                captionSlot: raw.productCategory.title,
                categoryId: raw.productCategory.id,
                images: raw.images,
                subTitle: raw.description,
            }));

            setFilteredProducts(formattedProducts);
        } catch (err) {
            setError(axios.isAxiosError(err)
                ? `Failed to load products: ${err.message}`
                : 'An unexpected error occurred'
            );
            console.error('Error fetching products:', err);
        } finally {
            setIsLoading(false);
            setIsSearching(false);
            setIsFiltering(false);
        }
    }, []);

    const handleSearch = useCallback(() => {
        if (searchValue.trim()) {
            setIsSearching(true);
            const categoryIds = selectedFilters.map(filter => filter.categoryId);
            updateQueryParams({ search: searchValue, categories: categoryIds, page: 1 });
            fetchProducts(searchValue, categoryIds);
        } else {
            const categoryIds = selectedFilters.map(filter => filter.categoryId);
            updateQueryParams({ search: '', categories: categoryIds, page: 1 });
            fetchProducts('', categoryIds);
        }
    }, [searchValue, selectedFilters, fetchProducts, updateQueryParams]);

    const handleFilterChange = useCallback((filters: Option[]) => {
        const categoryFilters = filters as CategoryOption[];
        setSelectedFilters(categoryFilters);

        setIsFiltering(true);
        const categoryIds = categoryFilters.map(filter => filter.categoryId);
        updateQueryParams({ search: searchValue, categories: categoryIds, page: 1 });
        fetchProducts(searchValue, categoryIds);
    }, [searchValue, fetchProducts, updateQueryParams]);

    const handlePageChange = useCallback((pageNumber: number) => {
        setCurrentPage(pageNumber);
        updateQueryParams({ page: pageNumber });
        window.scrollTo({ top: 0, behavior: 'smooth' });
    }, [updateQueryParams]);

    useEffect(() => {
        fetchCategories();
    }, [fetchCategories]);

    useEffect(() => {
        const queryParams = qs.parse(location.search, { ignoreQueryPrefix: true }) as QueryParams;
        const searchTerm = queryParams.search || '';
        const categoryIds = queryParams.categories
            ? queryParams.categories.split(',').map(Number)
            : [];

        fetchProducts(searchTerm, categoryIds);
    }, [location.search, fetchProducts]);

    const paginatedProducts = useMemo(() => {
        const lastIndex = currentPage * PRODUCTS_PER_PAGE;
        const firstIndex = lastIndex - PRODUCTS_PER_PAGE;
        return filteredProducts.slice(firstIndex, lastIndex);
    }, [filteredProducts, currentPage]);

    const totalPages = Math.ceil(filteredProducts.length / PRODUCTS_PER_PAGE);

    const handleSearchChange = (value: string) => {
        setSearchValue(value);
    };

    const handleRetry = () => {
        window.location.reload();
    };

    const getImageUrl = (image: ProductImage): string => {
        return image.formats?.large?.url || image.url || '/placeholder-image.jpg';
    };

    const handleKeyPress = (event: React.KeyboardEvent<HTMLInputElement>) => {
        if (event.key === 'Enter') {
            handleSearch();
        }
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
                            image={getImageUrl(product.images[0])}
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
                        onKeyPress={handleKeyPress}
                        placeholder="Search Product"
                        disabled={isLoading}
                    />
                    <Button
                        className={classes.button}
                        loading={isLoading || isSearching || isFiltering}
                        onClick={handleSearch}
                    >
                        Find Now
                    </Button>
                </div>

                <MultiDropdown
                    className={classes.dropDown}
                    value={selectedFilters}
                    getTitle={(filters) => filters.length > 0 ? `${filters.map(filter => filter.value).join(', ')}` : 'Filter'}
                    onChange={handleFilterChange}
                    options={categoryOptions}
                    disabled={isLoading || categories.length === 0}
                />
            </div>

            <div className={classes.products}>
                {renderContent()}
            </div>
        </div>
    );
}

export default Products;
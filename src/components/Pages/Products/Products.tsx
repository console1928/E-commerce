import { observer } from 'mobx-react-lite';
import { useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import qs from 'qs';
import Card from 'components/Card';
import Button from 'components/Button';
import Input from 'components/Input';
import Text from 'components/Text';
import MultiDropdown, { Option } from 'components/MultiDropdown';
import Pagination from 'components/Pagination';
import { productsStore } from 'stores/products.store';
import { CategoryOption } from 'stores/products.store';
import classes from './Products.module.scss';

const Products = observer(() => {
    const location = useLocation();
    const navigate = useNavigate();
    const {
        searchValue,
        setSearchValue,
        currentPage,
        setCurrentPage,
        isLoading,
        isSearching,
        isFiltering,
        error,
        selectedFilters,
        setSelectedFilters,
        categories,
        categoryOptions,
        filteredProducts,
        paginatedProducts,
        totalPages,
        fetchCategories,
        fetchProducts,
        searchProducts,
        filterProducts,
        syncWithQueryParams
    } = productsStore;

    const updateQueryParams = (params: {
        search?: string;
        categories?: number[];
        page?: number;
    }) => {
        const queryParams = qs.parse(location.search, { ignoreQueryPrefix: true }) as {
            search?: string;
            categories?: string;
            page?: string;
        };

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
    };

    const handleSearch = () => {
        const categoryIds = selectedFilters.map(filter => filter.categoryId);
        updateQueryParams({
            search: searchValue.trim(),
            categories: categoryIds,
            page: 1
        });
        searchProducts();
    };

    const handleFilterChange = (filters: Option[]) => {
        const categoryFilters = filters as CategoryOption[];
        setSelectedFilters(categoryFilters);

        const categoryIds = categoryFilters.map(filter => filter.categoryId);
        updateQueryParams({
            search: searchValue,
            categories: categoryIds,
            page: 1
        });
        filterProducts(categoryFilters);
    };

    const handlePageChange = (pageNumber: number) => {
        setCurrentPage(pageNumber);
        updateQueryParams({ page: pageNumber });
        window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    useEffect(() => {
        const queryParams = qs.parse(location.search, { ignoreQueryPrefix: true }) as {
            search?: string;
            categories?: string;
            page?: string;
        };

        syncWithQueryParams(queryParams);

        if (categories.length === 0) {
            fetchCategories();
        }

        if (filteredProducts.length === 0) {
            const searchTerm = queryParams.search || '';
            const categoryIds = queryParams.categories
                ? queryParams.categories.split(',').map(Number)
                : [];
            fetchProducts(searchTerm, categoryIds);
        }
    }, [location.search]);

    const handleSearchChange = (value: string) => {
        setSearchValue(value);
    };

    const handleRetry = () => {
        window.location.reload();
    };

    const getImageUrl = (image: any): string => {
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
                            productsPerPage={productsStore.PRODUCTS_PER_PAGE}
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
});

export default Products;
import { observer } from 'mobx-react-lite';
import { useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import qs from 'qs';
import { productsStore } from 'stores/products.store';
import { CategoryOption } from 'stores/products.store';
import ProductsHeader from './ProductsHeader';
import ProductsSearch from './ProductsSearch';
import ProductsContent from './ProductsContent';
import { Option } from 'components/MultiDropdown';
import styles from './Products.module.scss';

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

    const handleSearchChange = (value: string) => {
        setSearchValue(value);
    };

    const handleRetry = () => {
        window.location.reload();
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

    return (
        <div className={`${styles.productsWrapper} wrapper`}>
            <ProductsHeader />

            <ProductsSearch
                searchValue={searchValue}
                onSearchChange={handleSearchChange}
                onSearch={handleSearch}
                selectedFilters={selectedFilters}
                onFilterChange={handleFilterChange}
                categoryOptions={categoryOptions}
                isLoading={isLoading}
                isSearching={isSearching}
                isFiltering={isFiltering}
                categories={categories}
            />

            <ProductsContent
                isLoading={isLoading}
                error={error}
                filteredProducts={filteredProducts}
                paginatedProducts={paginatedProducts}
                totalPages={totalPages}
                searchValue={searchValue}
                selectedFilters={selectedFilters}
                currentPage={currentPage}
                onPageChange={handlePageChange}
                onRetry={handleRetry}
            />
        </div>
    );
});

export default Products;
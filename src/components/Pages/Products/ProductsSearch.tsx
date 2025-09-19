import React from 'react';
import Input from 'components/Input';
import Button from 'components/Button';
import MultiDropdown, { Option } from 'components/MultiDropdown';
import { CategoryOption } from 'stores/products.store';
import styles from './Products.module.scss';

interface ProductsSearchProps {
    searchValue: string;
    onSearchChange: (value: string) => void;
    onSearch: () => void;
    selectedFilters: CategoryOption[];
    onFilterChange: (filters: Option[]) => void;
    categoryOptions: CategoryOption[];
    isLoading: boolean;
    isSearching: boolean;
    isFiltering: boolean;
    categories: any[];
}

const ProductsSearch: React.FC<ProductsSearchProps> = ({
    searchValue,
    onSearchChange,
    onSearch,
    selectedFilters,
    onFilterChange,
    categoryOptions,
    isLoading,
    isSearching,
    isFiltering,
    categories
}) => {
    const handleKeyPress = (event: React.KeyboardEvent<HTMLInputElement>) => {
        if (event.key === 'Enter') {
            onSearch();
        }
    };

    return (
        <div className={styles.searchWrapper}>
            <div className={styles.search}>
                <Input
                    value={searchValue}
                    onChange={onSearchChange}
                    onKeyPress={handleKeyPress}
                    placeholder="Search Product"
                    disabled={isLoading}
                />
                <Button
                    className={styles.button}
                    loading={isLoading || isSearching || isFiltering}
                    onClick={onSearch}
                >
                    Find Now
                </Button>
            </div>

            <MultiDropdown
                className={styles.dropDown}
                value={selectedFilters}
                getTitle={(filters) => filters.length > 0 ? `${filters.map(filter => filter.value).join(', ')}` : 'Filter'}
                onChange={onFilterChange}
                options={categoryOptions}
                disabled={isLoading || categories.length === 0}
            />
        </div>
    );
};

export default ProductsSearch;
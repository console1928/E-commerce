import { makeAutoObservable, runInAction } from 'mobx';
import axios from 'axios';

export interface ProductImage {
    id?: number;
    url: string;
    formats?: {
        large?: { url: string };
        medium?: { url: string };
        small?: { url: string };
        thumbnail?: { url: string };
    };
}

export interface ProductType {
    documentId: number;
    title: string;
    price: number;
    productCategory: { id: number; title: string };
    description: string;
    images: ProductImage[];
}

export interface ProductData {
    id: number;
    title: string;
    contentSlot: number;
    subTitle: string;
    images: ProductImage[];
    captionSlot: string;
    categoryId?: number;
}

export interface Category {
    id: number;
    title: string;
}

export interface CategoryOption {
    key: string;
    value: string;
    categoryId: number;
}

interface QueryParams {
    search?: string;
    categories?: string;
    page?: string;
}

class ProductsStore {
    products: ProductData[] = [];
    filteredProducts: ProductData[] = [];
    categories: Category[] = [];
    selectedFilters: CategoryOption[] = [];
    searchValue: string = '';
    currentPage: number = 1;
    isLoading: boolean = false;
    isSearching: boolean = false;
    isFiltering: boolean = false;
    error: string | null = null;

    readonly PRODUCTS_PER_PAGE = 9;
    readonly BASE_API_URL = 'https://front-school-strapi.ktsdev.ru/api/products';
    readonly CATEGORIES_API_URL = 'https://front-school-strapi.ktsdev.ru/api/product-categories';

    constructor() {
        makeAutoObservable(this);
    }

    setSearchValue = (value: string) => {
        this.searchValue = value;
    };

    setCurrentPage = (page: number) => {
        this.currentPage = page;
    };

    setSelectedFilters = (filters: CategoryOption[]) => {
        this.selectedFilters = filters;
    };

    setError = (error: string | null) => {
        this.error = error;
    };

    fetchCategories = async () => {
        try {
            const response = await axios.get(this.CATEGORIES_API_URL);
            const categoriesData = response.data.data.map((cat: any) => ({
                id: cat.id,
                title: cat.title || 'Unnamed Category'
            }));

            runInAction(() => {
                this.categories = categoriesData;
            });
        } catch (err) {
            console.error('Error fetching categories:', err);
        }
    };

    fetchProducts = async (searchTerm: string = '', categoryIds: number[] = []) => {
        try {
            runInAction(() => {
                this.isLoading = true;
                this.error = null;
            });

            let apiUrl = `${this.BASE_API_URL}?populate[0]=images&populate[1]=productCategory`;

            if (searchTerm.trim()) {
                apiUrl += `&filters[title][$containsi]=${encodeURIComponent(searchTerm)}`;
            }

            if (categoryIds.length > 0) {
                categoryIds.forEach((categoryId, index) => {
                    apiUrl += `&filters[productCategory][id][$in][${index}]=${categoryId}`;
                });
            }

            const response = await axios.get<{ data: ProductType[] }>(apiUrl, {
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

            runInAction(() => {
                this.filteredProducts = formattedProducts;
                this.isLoading = false;
                this.isSearching = false;
                this.isFiltering = false;
            });
        } catch (err) {
            runInAction(() => {
                this.error = axios.isAxiosError(err)
                    ? `Failed to load products: ${err.message}`
                    : 'An unexpected error occurred';
                this.isLoading = false;
                this.isSearching = false;
                this.isFiltering = false;
            });
            console.error('Error fetching products:', err);
        }
    };

    searchProducts = () => {
        this.isSearching = true;
        const categoryIds = this.selectedFilters.map(filter => filter.categoryId);
        this.fetchProducts(this.searchValue, categoryIds);
    };

    filterProducts = (filters: CategoryOption[]) => {
        this.setSelectedFilters(filters);
        this.isFiltering = true;
        const categoryIds = filters.map(filter => filter.categoryId);
        this.fetchProducts(this.searchValue, categoryIds);
    };

    get categoryOptions(): CategoryOption[] {
        return this.categories.map(category => ({
            key: category.id.toString(),
            value: category.title,
            categoryId: category.id
        }));
    }

    get paginatedProducts(): ProductData[] {
        const lastIndex = this.currentPage * this.PRODUCTS_PER_PAGE;
        const firstIndex = lastIndex - this.PRODUCTS_PER_PAGE;
        return this.filteredProducts.slice(firstIndex, lastIndex);
    }

    get totalPages(): number {
        return Math.ceil(this.filteredProducts.length / this.PRODUCTS_PER_PAGE);
    }

    syncWithQueryParams = (queryParams: QueryParams) => {
        if (queryParams.search) {
            this.setSearchValue(queryParams.search);
        }

        if (queryParams.page) {
            this.setCurrentPage(Number(queryParams.page));
        }

        if (queryParams.categories && this.categories.length > 0) {
            const categoryIds = queryParams.categories.split(',').map(Number);
            const filters = this.categories
                .filter(cat => categoryIds.includes(cat.id))
                .map(cat => ({
                    key: cat.id.toString(),
                    value: cat.title,
                    categoryId: cat.id
                }));
            this.setSelectedFilters(filters);
        }
    };
}

export const productsStore = new ProductsStore();
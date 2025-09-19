import { makeAutoObservable, runInAction } from 'mobx';
import axios from 'axios';
import { ProductType, ProductImage } from './products.store';

export interface RelatedProduct {
    id: number;
    title: string;
    price: number;
    productCategory: { title: string };
    description: string;
    images: ProductImage[];
}

class ProductStore {
    product: ProductType | null = null;
    relatedItems: RelatedProduct[] = [];
    loading: boolean = false;
    error: string | null = null;

    readonly API_BASE_URL = 'https://front-school-strapi.ktsdev.ru/api/products';

    constructor() {
        makeAutoObservable(this);
    }

    setLoading = (loading: boolean) => {
        this.loading = loading;
    };

    setError = (error: string | null) => {
        this.error = error;
    };

    fetchProductData = async (id: string) => {
        if (!id) return;

        try {
            runInAction(() => {
                this.loading = true;
                this.error = null;
            });

            const [productResponse, productsResponse] = await Promise.all([
                axios.get<{ data: ProductType }>(`${this.API_BASE_URL}/${id}?populate[0]=images&populate[1]=productCategory`),
                axios.get<{ data: ProductType[] }>(`${this.API_BASE_URL}?populate[0]=images&populate[1]=productCategory`),
            ]);

            const productData = productResponse.data.data;
            const allProducts = productsResponse.data.data;

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

            runInAction(() => {
                this.product = productData;
                this.relatedItems = related;
                this.loading = false;
            });
        } catch (err) {
            runInAction(() => {
                this.error = 'Failed to load product data';
                this.loading = false;
            });
            console.error('Error fetching product:', err);
        }
    };

    clearProduct = () => {
        this.product = null;
        this.relatedItems = [];
        this.error = null;
    };
}

export const productStore = new ProductStore();
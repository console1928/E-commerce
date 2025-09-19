import { productsStore } from './products.store';
import { productStore } from './product.store';

export class RootStore {
    productsStore = productsStore;
    productStore = productStore;
}

export const rootStore = new RootStore();
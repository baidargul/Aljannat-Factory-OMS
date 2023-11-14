
import { v4 } from 'uuid'
import { create } from 'zustand'

export const usePOS = create((set) => ({
    products: [],

    addProduct(id: string, productName: string, variantName: string, weight: string, amount: number) {
        set((state: any) => {
            const updatedProducts = [...state.products, { id, productName, variantName, weight, amount }];
            return {
                products: updatedProducts,
            };
        });
    },

    removeProduct(id: string) {
        set((state: any) => {
            const updatedProducts = state.products.filter((item: any) => item.id !== id);
            return {
                products: updatedProducts,
            };
        });
    },

    changeWeight(id: string, weight: string) {
        set((state: any) => {
            const updatedProducts = state.products.map((item: any) => item.id === id ? { ...item, weight } : item);
            return {
                products: updatedProducts,
            };
        });
    },

    changeAmount(id: string, amount: number) {
        set((state: any) => {
            const updatedProducts = state.products.map((item: any) => item.id === id ? { ...item, amount } : item);
            return {
                products: updatedProducts,
            };
        });
    }
}))
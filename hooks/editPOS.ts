import { v4 } from 'uuid';
import { create, SetState } from 'zustand';

type Product = {
  id: string;
  productName: string;
  variantName: string;
  weight: number;
  amount: number;
  unit: string;
};

type StoreState = {
  products: Product[];
  customer: any;
  addProduct: (id: string, productName: string, variantName: string, weight: number, amount: number, unit: string) => void;
  removeProduct: (id: string) => void;
  changeWeight: (id: string, weight: number) => void;
  changeAmount: (id: string, amount: number) => void;
  getTotalAmount: () => number;
  getTotalWeight: () => number;
};

export const useEditPOS = create<StoreState>((set: SetState<StoreState>) => ({
  products: [],
  customer: null,

  addProduct(id, productName, variantName, weight, amount, unit) {
    set((state) => {
      if(state.products.find((item) => item.id === id)) return state;
      const updatedProducts = [...state.products, { id, productName, variantName, weight, amount, unit }];
      return {
        products: updatedProducts,
      };
    });
  },

  removeProduct(id) {
    set((state) => {
      const updatedProducts = state.products.filter((item) => item.id !== id);
      return {
        products: updatedProducts,
      };
    });
  },

  changeWeight(id, weight) {
    set((state) => {
      const updatedProducts = state.products.map((item) => (item.id === id ? { ...item, weight } : item));
      return {
        products: updatedProducts,
      };
    });
  },

  changeAmount(id, amount) {
    set((state) => {
      const updatedProducts = state.products.map((item) => (item.id === id ? { ...item, amount } : item));
      return {
        products: updatedProducts,
      };
    });
  },

  getTotalAmount() {
    let total = 0;
    this?.products.forEach((item) => {
      total += Number(item.amount);
    });
    return total;
  },

  getTotalWeight() {
    let total = 0;
    this?.products.forEach((item) => {
      total += Number(item.weight);
    });
    return total;
  },
}));

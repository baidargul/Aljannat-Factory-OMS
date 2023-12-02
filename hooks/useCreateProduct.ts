import { product, productVariations } from '@prisma/client';
import { v4 } from 'uuid';
import { create, SetState } from 'zustand';


type productWithVariations = {
    product: product;
    productVariations: productVariations[]
}

type createProduct = {
  selectedProduct: productWithVariations | null;

};

export const useCreateProduct = create<createProduct>((set: SetState<createProduct>) => ({
 selectedProduct: null,

}));

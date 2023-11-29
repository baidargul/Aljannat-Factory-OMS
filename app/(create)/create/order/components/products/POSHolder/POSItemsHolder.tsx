'use client'
import React from 'react';
import POSItem from '../POSItem';
import POSVariation from '../POSVariation';
import { ArrowLeft } from 'lucide-react';
import { ScrollArea } from '@/components/ui/scroll-area';

type Props = {
  products: any;
  selectedProduct: any;
  setSelectedProduct: any;
};

const POSItemsHolder = ({ products, selectedProduct, setSelectedProduct }: Props) => {
  const handleBackButton = () => {
    setSelectedProduct(null);
  };

  return (
    <>
      <div className='bg-red-800 text-white p-2'>Products</div>
      <ScrollArea className={`${selectedProduct ? 'hidden' : 'h-[600px]'}  p-2 pr-4`} type='always'>
        <div className={`grid grid-cols-2 ${selectedProduct && 'hidden'}`}>
          {products.map((product: any) => (
            <div key={product.name} className=''>
              <POSItem
                key={product.id}
                product={product}
                setSelectedProduct={setSelectedProduct}
                selectedProduct={selectedProduct}
              />
            </div>
          ))}
        </div>
      </ScrollArea>
      {selectedProduct && (
        <div className='flex flex-col gap-2 text-ellipsis overflow-hidden whitespace-nowrap '>
          <button onClick={handleBackButton} className='p-2 w-16 px-2 rounded-md mt-2 bg-red-800 text-white'>
            <ArrowLeft className='animate-pulse' />
          </button>
          <ScrollArea className='h-[500px] bg-slate-400 p-2 pr-4' type='always'>
            <div className='grid grid-cols-2 gap-1'>
              {selectedProduct.productVariations.map((variation: any) => (
                <div key={variation.id}>
                  <POSVariation selectedProduct={selectedProduct} variation={variation} setSelectedProduct={setSelectedProduct} />
                </div>
              ))}
            </div>
          </ScrollArea>
        </div>
      )}
    </>
  );
};

export default POSItemsHolder;

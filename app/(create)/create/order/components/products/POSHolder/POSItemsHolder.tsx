'use client'
import React from 'react'
import POSItem from '../POSItem'
import POSVariation from '../POSVariation'
import { ArrowLeft } from 'lucide-react'
import { ScrollArea } from '@/components/ui/scroll-area'

type Props = {
    products: any
    selectedProduct: any
    setSelectedProduct: any
}

const POSItemsHolder = (props: Props) => {
    const handleBackButton = () => {
        props.setSelectedProduct(null)
    }

    return (
        <>
            <div className='bg-red-800 text-white p-2'>Products</div>
            <ScrollArea className={`${props.selectedProduct ? "hidden" : "h-[600px]"}  p-2 pr-4`} type='always'>
                <div className={`grid grid-cols-2 ${props.selectedProduct && "hidden"}`}>
                    {
                        props.products.map((product: any) => {
                            return (
                                <div key={product.name} className=''>
                                    <POSItem
                                        key={product.id}
                                        product={product}
                                        setSelectedProduct={props.setSelectedProduct}
                                        selectedProduct={props.selectedProduct}
                                    />
                                </div>
                            )
                        })
                    }
                </div>
            </ScrollArea>
            <div>
                {
                    props.selectedProduct && (
                        <div className='flex flex-col gap-2 text-ellipsis overflow-hidden whitespace-nowrap '>
                            <button onClick={handleBackButton} className='p-2 w-16 px-2 rounded-md mt-2 bg-red-800 text-white'><ArrowLeft className='animate-pulse' /></button>
                            <ScrollArea className='h-[500px] bg-slate-400 p-2 pr-4' type='always'>
                                <div className='grid grid-cols-2 gap-1'>
                                    {
                                        props.selectedProduct.productVariations.map((variation: any) => {
                                            return (
                                                <div key={variation.id}>
                                                    <POSVariation selectedProduct={props.selectedProduct} variation={variation} setSelectedProduct={props.setSelectedProduct} />
                                                </div>
                                            )
                                        })
                                    }
                                </div>
                            </ScrollArea>
                        </div>
                    )
                }
            </div>
        </>
    )
}

export default POSItemsHolder
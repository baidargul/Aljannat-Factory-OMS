'use client'
import { useCreateProduct } from '@/hooks/useCreateProduct'
import { product, productVariations } from '@prisma/client'
import { useRouter } from 'next/navigation'
import React, { useEffect, useState } from 'react'

type Props = {}

type productWithVariations = {
    product: product;
    productVariations: productVariations[]
}

const SelectedProduct = (props: Props) => {
    const [selectedProduct, setSelectedProduct] = useState<productWithVariations | null>(null)
    const router = useRouter()
    const productObj = useCreateProduct()

    useEffect(() => {
        setSelectedProduct(productObj.selectedProduct)
    }, [productObj.selectedProduct, productObj])

    function onClearClick() {
        productObj.selectedProduct = null
        router.refresh()
    }

    return (
        <div className='flex gap-1 items-center justify-center'>
            {/* {
                productObj.selectedProduct && (
                    <div onClick={() => onClearClick()} className='bg-cyan-500 text-xs w-4 h-4 hover:scale-105 hover:drop-shadow-md transition-all cursor-pointer text-center rounded-full flex justify-center items-center text-white'>
                        -
                    </div>
                )
            } */}

            <div className='font-semibold text-2xl bg-red-800 text-center text-white w-full'>
                {selectedProduct ? selectedProduct.product.name : 'No Product Selected'}
            </div>
        </div>
    )
}

export default SelectedProduct
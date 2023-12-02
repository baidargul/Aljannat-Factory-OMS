'use client'
import { useCreateProduct } from '@/hooks/useCreateProduct'
import { product, productVariations } from '@prisma/client'
import Image from 'next/image'
import React, { use, useEffect, useState } from 'react'
import VariationSelector from './VariationSelector'

type Props = {}

type productWithVariations = {
    product: product;
    productVariations: productVariations[]
}

const AvailableVariations = (props: Props) => {
    const [selectedProduct, setSelectedProduct] = useState<productWithVariations | null>(null)

    const productObj = useCreateProduct()

    useEffect(() => {
        setSelectedProduct(productObj.selectedProduct)
    }, [productObj, productObj.selectedProduct])

    function onClearClick() {

    }

    return (
        <div>
            <div className='grid grid-cols-2'>
                {
                    selectedProduct?.productVariations.map((variation: productVariations) => {

                        return (
                            <div>
                                <VariationSelector>
                                    <div key={variation.id} className='flex gap-1 items-center border p-1 w-fit rounded'>

                                        <div>
                                            <Image src={`https://getpcsofts.info/wp-content/uploads/2023/09/JetBrains-DataGrip-Crack-300x202.png`} width={65} height={65} className='w-24 h-24' alt='image' />
                                        </div>
                                        <div>
                                            <div className='font-semibold tracking-wide flex gap-1 items-center'>
                                                <div>
                                                    <div onClick={() => onClearClick()} className='bg-red-500 text-xs w-4 h-4 hover:scale-105 hover:drop-shadow-md transition-all cursor-pointer text-center rounded-full flex justify-center items-center text-white'>
                                                        -
                                                    </div>
                                                </div>
                                                <div>
                                                    {
                                                        variation.name
                                                    }
                                                </div>
                                            </div>
                                            <div className='flex gap-1 items-center text-xs'>
                                                <table>
                                                    <thead>
                                                        <tr>
                                                            <th className='border p-1 bg-slate-300'>Price</th>
                                                            <th className='border p-1 bg-slate-300'>Weight</th>
                                                            <th className='border p-1 bg-slate-300'>Unit</th>
                                                        </tr>
                                                    </thead>
                                                    <tbody>
                                                        <tr className='w-44'>
                                                            <td className='border text-center justify-center'>{variation.defaultAmount}</td>
                                                            <td className='border text-center justify-center'>{Number(variation.defaultWeight)}</td>
                                                            <td className='border text-center justify-center'>{String(variation.defaultUnit).toLocaleUpperCase()}</td>
                                                        </tr>
                                                    </tbody>
                                                </table>

                                            </div>
                                        </div>
                                    </div>
                                </VariationSelector>
                            </div>
                        )

                    })
                }
            </div>
        </div>
    )
}

export default AvailableVariations
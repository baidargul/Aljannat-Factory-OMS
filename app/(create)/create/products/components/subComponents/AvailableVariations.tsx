'use client'
import { useCreateProduct } from '@/hooks/useCreateProduct'
import { product, productVariations } from '@prisma/client'
import Image from 'next/image'
import React, { use, useEffect, useState } from 'react'
import VariationSelector from './VariationSelector'
import { ScrollArea } from '@/components/ui/scroll-area'

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
        <ScrollArea type='always' className='h-[300px] w-full border border-red-800 p-2'>
            <div className='grid grid-cols-3 gap-1 justify-items-center justify-between w-full'>
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
                                            <div className='font-semibold tracking-wide flex gap-1 items-center  group-hover:-mt-2 transition-all'>
                                                <div>
                                                    <div onClick={() => onClearClick()} className='bg-red-500 text-xs w-4 h-4 hover:scale-105 hover:drop-shadow-md transition-all cursor-pointer text-center rounded-full flex justify-center items-center text-white'>
                                                        -
                                                    </div>
                                                </div>
                                                <div className='group-hover:tracking-widest transition-all duration-1000'>
                                                    {
                                                        variation.name
                                                    }
                                                </div>
                                            </div>
                                            <div className='flex gap-1 items-center text-xs group-hover:mt-2 transition-all'>
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
        </ScrollArea>
    )
}

export default AvailableVariations

function LoadingSkeleton(variation: productVariations) {
    return (
        <div key={variation.id} className='flex gap-1 items-center border p-1 w-fit rounded animate-pulse'>
            <div className='w-24 h-24 bg-gray-300 rounded' /> {/* Placeholder for Image */}
            <div>
                <div className='font-semibold tracking-wide flex gap-1 items-center group-hover:-mt-2 transition-all'>
                    <div>
                        <div className='bg-gray-300 text-xs w-4 h-4 hover:scale-105 hover:drop-shadow-md transition-all cursor-pointer text-center rounded-full flex justify-center items-center text-white'>
                            -
                        </div>
                    </div>
                    <div className='group-hover:tracking-widest bg-gray-300 w-20 h-4 transition-all duration-1000' /> {/* Placeholder for variation.name */}
                </div>
                <div className='flex gap-1 items-center text-xs group-hover:mt-2 transition-all'>
                    <table>
                        <thead>
                            <tr>
                                <th className='border p-1 bg-gray-300 w-16' /> {/* Placeholder for Price */}
                                <th className='border p-1 bg-gray-300 w-16' /> {/* Placeholder for Weight */}
                                <th className='border p-1 bg-gray-300 w-16' /> {/* Placeholder for Unit */}
                            </tr>
                        </thead>
                        <tbody>
                            <tr className='w-44'>
                                <td className='border text-center justify-center bg-gray-300' /> {/* Placeholder for variation.defaultAmount */}
                                <td className='border text-center justify-center bg-gray-300' /> {/* Placeholder for variation.defaultWeight */}
                                <td className='border text-center justify-center bg-gray-300' /> {/* Placeholder for variation.defaultUnit */}
                            </tr>
                        </tbody>
                    </table>
                </div>
            </div>
        </div>

    )
}
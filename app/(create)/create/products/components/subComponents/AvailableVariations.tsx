'use client'
import { useCreateProduct } from '@/hooks/useCreateProduct'
import { product, productVariations } from '@prisma/client'
import Image from 'next/image'
import React, { use, useEffect, useState } from 'react'
import VariationSelector from './VariationSelector'
import { ScrollArea } from '@/components/ui/scroll-area'
import { PlusCircleIcon } from 'lucide-react'
import DialogProvider from '@/components/DialogProvider/DialogProvider'
import CreateProductForm from '../CreateProductForm'

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
        <ScrollArea type='always' className='h-[400px] w-full border-y border-zinc-800 p-2'>
            <div className='grid grid-cols-6 gap-1 justify-items-center justify-between w-full'>
                {
                    selectedProduct?.productVariations.map((variation: productVariations) => {

                        return (
                            <div>
                                <VariationSelector>
                                    <div key={variation.id} className='flex justify-center gap-2 items-center border border-slate-300 p-2 rounded w-60'>

                                        <div className='border border-white drop-shadow-sm transition-all'>
                                            <Image src={`/Placeholders/question.png`} width={100} height={100} className='w-16 h-16 bg-background drop-shadow-none border-none' alt='image' />
                                        </div>
                                        <div>
                                            <div className='font-semibold tracking-wide flex gap-1 items-center transition-all'>
                                                <div>
                                                    <div onClick={() => onClearClick()} className='bg-gradient-to-t from-red-700 to-red-500 text-xs w-4 h-4 hover:scale-105 hover:drop-shadow-md transition-all cursor-pointer text-center rounded-full flex justify-center items-center text-white'>
                                                        -
                                                    </div>
                                                </div>
                                                <div className='transition-all duration-1000'>
                                                    {
                                                        variation.name
                                                    }
                                                </div>
                                            </div>
                                            <div className='flex gap-1 items-center text-xs transition-all'>
                                                <table className='bg-gradient-to-t from-slate-100 to-gray-400'>
                                                    <thead className='border border-slate-400'>
                                                        <tr className=''>
                                                            <th className='border p-1 bg-gradient-to-b from-slate-100 to-gray-400'>Price</th>
                                                            <th className='border p-1 bg-gradient-to-b from-slate-100 to-gray-400'>Weight</th>
                                                            <th className='border p-1 bg-gradient-to-b from-slate-100 to-gray-400'>Unit</th>
                                                        </tr>
                                                    </thead>
                                                    <tbody className={`border border-slate-400 transition-all duration-1000`}>
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
                <div>
                    {selectedProduct &&
                        <div className='mt-[2px]'>
                            <DialogProvider title='Create product' description='Specify product name and image.' content={<CreateProductForm />}>
                                {handleLastAddButton()}
                            </DialogProvider>
                        </div>
                    }
                </div>
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

function handleLastAddButton() {
    return (
        <div className='w-60 h-20 group hover: active:scale-90 transition-all bg-gradient-to-br from-amber-50 to-emerald-50 flex gap-1 justify-center items-center rounded-md border border-slate-300 hover:drop-shadow-sm'>
            <PlusCircleIcon className='w-6 h-6 text-green-800 group-active:text-orange-400 transition-all duration-200' />
            <p className='text-green-800 group-hover:tracking-wide group-active:text-orange-400 transition-all duration-200' >Add</p>
        </div>
    )
}
'use client'
import { useCreateProduct } from '@/hooks/useCreateProduct'
import { product, productVariations } from '@prisma/client'
import Image from 'next/image'
import React, { useEffect, useState } from 'react'
import VariationSelector from './VariationSelector'
import { ScrollArea } from '@/components/ui/scroll-area'
import { PlusCircleIcon } from 'lucide-react'
import DialogProvider from '@/components/DialogProvider/DialogProvider'
import CreateVariationForm from '../CreateVariationForm'
import { formalizeText } from '@/lib/my'

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

    return (
        selectedProduct &&
        <ScrollArea type='always' className='h-[400px] w-full border-y border-zinc-800 p-2'>
            <div className='grid grid-cols-6 gap-1 justify-items-center justify-between w-full'>
                {
                    selectedProduct && selectedProduct?.productVariations.map((variation: productVariations) => {

                        return (
                            <div key={variation.id}>
                                <VariationSelector selectedProduct={selectedProduct} variant={variation} setSelectedProduct={setSelectedProduct}>
                                    <div key={variation.id} className='flex justify-center gap-2 items-center border border-slate-300 p-2 rounded w-60'>

                                        {/* <div className='border border-white drop-shadow-sm transition-all'>
                                            <Image src={variation.imageUrl ? variation.imageUrl : `/Placeholders/question.png`} width={100} height={100} className='w-16 h-16 bg-background drop-shadow-none border-none' alt='image' />
                                        </div> */}
                                        <div>
                                            <div className='font-semibold tracking-wide flex gap-1 items-center transition-all'>
                                                <div className='transition-all duration-1000 w-24 truncate'>
                                                    {
                                                        formalizeText(variation.name)
                                                    }
                                                </div>
                                            </div>
                                            <div className='flex gap-1 items-center text-xs transition-all w-full'>
                                                <table className='bg-gradient-to-t from-slate-100 to-gray-400 w-full'>
                                                    <thead className='border border-slate-400 w-full'>
                                                        <tr className=''>
                                                            <th className='border p-1 bg-gradient-to-b from-slate-100 to-gray-400'>Price</th>
                                                            <th className='border p-1 bg-gradient-to-b from-slate-100 to-gray-400'>Weight</th>
                                                            <th className='border p-1 bg-gradient-to-b from-slate-100 to-gray-400'>Unit</th>
                                                        </tr>
                                                    </thead>
                                                    <tbody className={`border border-slate-400 transition-all duration-1000`}>
                                                        <tr className='w-full'>
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
                        <div className=''>
                            <DialogProvider title='Add new variation' description={`to ` + selectedProduct.product.name} content={<CreateVariationForm selectedProduct={selectedProduct.product.id} setSelectedProduct={setSelectedProduct} />}>
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


function handleLastAddButton() {
    return (
        <div className='w-60 h-20 mt-[3px] group hover: active:scale-90 transition-all bg-gradient-to-br from-amber-50 to-emerald-50 flex gap-1 justify-center items-center rounded-md border border-slate-300 hover:drop-shadow-sm'>
            <PlusCircleIcon className='w-6 h-6 text-green-800 group-active:text-orange-400 transition-all duration-200' />
            <p className='text-green-800 group-hover:tracking-wide group-active:text-orange-400 transition-all duration-200' >Add</p>
        </div>
    )
}
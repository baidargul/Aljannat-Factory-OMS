import React from 'react'
import prisma from '@/lib/prisma'
import { product, productVariations } from '@prisma/client'
import AvailableProductSelector from './subComponents/AvailableProductSelector'
import Image from 'next/image'
import { ScrollArea } from '@/components/ui/scroll-area'
import { PlusCircleIcon } from 'lucide-react'
import DialogProvider from '@/components/DialogProvider/DialogProvider'
import CreateProductForm from './CreateProductForm'
import { formalizeText } from '@/lib/my'
type Props = {}


const AvailableProducts = async (props: Props) => {

    const availableProducts = await prisma.product.findMany({
        include: {
            productVariations: true
        },
        orderBy: {
            name: 'asc'
        }
    })

    if (!availableProducts) return (<div>No products available</div>)

    return (
        <div>
            <ScrollArea className='h-[300px]' type='always'>
                <div className='grid grid-cols-6 gap-1'>
                    {
                        availableProducts.map((product: any, index: number) => {
                            const productVariations: productVariations[] = product.productVariations
                            return (
                                <div key={product.id}>
                                    <AvailableProductSelector product={product}>
                                        <div className='flex h-20 gap-1 items-center group hover:drop-shadow-lg transition-all duration-1000 bg-gradient-to-r from-slate-50 to-slate-200 drop-shadow-sm border border-slate-200 hover:border-slate-300 p-2 rounded w-60'>
                                            {/* <div className='border border-white drop-shadow-sm group-hover: transition-all'>
                                                <Image src={product.imageUrl ? product.imageUrl : `/Placeholders/question.png`} className='w-16 h-16 rounded' width={100} height={100} alt='image' />
                                            </div> */}
                                            <div className='flex flex-col items-start text-start'>
                                                <div className='font-semibold tracking-tights'>
                                                    {formalizeText(product.name)}
                                                </div>
                                                <div className={`text-xs text-start w-fit transition-all duration-1000 -ml-2 scale-75 p-1 bg-slate-50 border border-slate-300 rounded-md ${productVariations.length < 1 && "hidden"}`}>
                                                    <div className={`flex gap-1 items-start ${productVariations.length < 1 && "hidden"}`}>
                                                        <div>
                                                            {productVariations.length ? productVariations.length : 0}
                                                        </div>
                                                        <div>
                                                            {productVariations.length > 1 ? 'variations' : productVariations.length < 1 ? "No variant" : 'variation'}
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </AvailableProductSelector>
                                </div>
                            )
                        })
                    }
                    <div>
                        {
                            <div className='mt-[1px]'>
                                <DialogProvider title='Create product' description='Specify product name and image.' content={<CreateProductForm />}>
                                    {handleLastAddButton()}
                                </DialogProvider>
                            </div>
                        }
                    </div>

                </div>
            </ScrollArea>
        </div>
    )
}

export default AvailableProducts

function handleLastAddButton() {
    return (
        <div className='w-60 h-20 group hover: active:scale-90 transition-all bg-gradient-to-br from-amber-50 to-emerald-50 flex gap-1 justify-center items-center rounded-md border border-slate-300 hover:drop-shadow-sm'>
            <PlusCircleIcon className='w-6 h-6 text-green-800 group-active:text-orange-400 transition-all duration-200' />
            <p className='text-green-800 group-hover:tracking-wide group-active:text-orange-400 transition-all duration-200' >Add</p>
        </div>
    )
}
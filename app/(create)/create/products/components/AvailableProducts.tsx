import React from 'react'
import prisma from '@/lib/prisma'
import { product, productVariations } from '@prisma/client'
import AvailableProductSelector from './subComponents/AvailableProductSelector'
import Image from 'next/image'
import { ScrollArea } from '@/components/ui/scroll-area'
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
            <ScrollArea className='h-[200px]' type='always'>
                <div className='grid grid-cols-3 gap-2'>
                    {
                        availableProducts.map((product: any) => {
                            const productVariations: productVariations[] = product.productVariations
                            return (
                                <div key={product.id}>
                                    <AvailableProductSelector product={product}>
                                        <div className='flex gap-1 items-center'>
                                            <div>
                                                <Image src={ product.imageUrl? product.imageUrl :  `/Placeholders/question.png`} className='w-16 h-16' width={32} height={32} alt='image' />
                                            </div>
                                            <div className='flex gap-1 items-center'>
                                                <div>
                                                    {product.name}
                                                </div>
                                                <div className={`text-xs text-start w-fit scale-75 p-1 bg-slate-50 border border-slate-300 rounded-md ${productVariations.length < 1 && "hidden"}`}>
                                                    {productVariations.length}
                                                </div>
                                            </div>
                                        </div>
                                    </AvailableProductSelector>
                                </div>
                            )
                        })
                    }
                </div>
            </ScrollArea>
        </div>
    )
}

export default AvailableProducts
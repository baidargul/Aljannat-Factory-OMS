'use client'
import { usePOS } from '@/hooks/usePOS'
import { formalizeText } from '@/lib/my'
import { product } from '@prisma/client'
import Image from 'next/image'
import React, { useEffect } from 'react'
import { v4 } from 'uuid'

type Props = {
    product: any
    setSelectedProduct: any
    selectedProduct: any
}

const POSItem = (props: Props) => {
    const POS: any = usePOS()

    const handleItemClick = () => {
        props.setSelectedProduct(props.product)
    }

    return (
        <div onClick={handleItemClick} className='p-2 bg-slate-200 border-slate-300 hover:bg-slate-100 hover:border-slate-300 active:bg-slate-300 border'>
            <div className='flex gap-2'>
                <Image className='rounded-md' src='https://www.vegrecipesofindia.com/wp-content/uploads/2014/07/suji-halwa-recipe.jpg' alt={props.product.name} width={80} height={80} />
                <div>
                    <div className='text-md uppercase tracking-wide font-semibold w-32 text-ellipsis overflow-hidden whitespace-nowrap'>
                        {formalizeText(props.product.name)}
                    </div>
                    <div className='flex gap-1 w-32 text-ellipsis overflow-hidden whitespace-nowrap'>
                        {
                            props.product.productVariations.map((variation: any) => {
                                return (
                                    <div key={v4()} className='flex gap-2 '>
                                        <div className='text-xs opacity-40'>
                                            {formalizeText(variation.name)},
                                        </div>
                                    </div>
                                )
                            })
                        }
                    </div>
                </div>
            </div>
        </div>
    )
}

export default POSItem
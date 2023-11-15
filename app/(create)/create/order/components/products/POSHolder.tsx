'use client'
import React, { useEffect, useState } from 'react'
import POSItem from './POSItem'
import POSVariation from './POSVariation'
import { usePOS } from '@/hooks/usePOS'
import { v4 } from 'uuid'
import { ScrollArea } from '@/components/ui/scroll-area'
import POSOrderRow from './POSOrderRow'
import POSRowsSummary from './POSRowsSummary'
import POSItemsHolder from './POSHolder/POSItemsHolder'
import POSOrderRowHolder from './POSHolder/POSOrderRowHolder'

type Props = {
    products: any
}

type productSpecifications = {
    id: string,
    weight: number,
    amount: number
}

const POSHolder = (props: Props) => {
    const [selectedProduct, setSelectedProduct] = useState<any>(null)
    const [totalAmount, setTotalAmount] = useState<number>(0)
    const POS: any = usePOS()

    useEffect(() => {
        console.log(`POS Products: `, POS.products)
    }, [POS.products])

    // useEffect(() => {
    //     let total = 0
    //     products.forEach((product: any) => {
    //         total += product.amount
    //     })
    //     setTotalAmount(total)
    //     console.log(`Products:`, products, `Amount: `, total)
    // }, [products])

    return (
        <div className="flex gap-2 min-h-screen">
            <div className='w-[40%] text-ellipsis overflow-hidden whitespace-nowrap p-2 bg-slate-200'>
                <POSItemsHolder products={props.products} selectedProduct={selectedProduct} setSelectedProduct={setSelectedProduct} />
            </div>
            <div className='w-[60%]'>
                <POSOrderRowHolder />
            </div>
        </div>
    )
}

export default POSHolder
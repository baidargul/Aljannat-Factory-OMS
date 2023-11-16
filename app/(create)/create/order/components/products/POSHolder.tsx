'use client'
import React, { useEffect, useState } from 'react'
import { usePOS } from '@/hooks/usePOS'
import POSItemsHolder from './POSHolder/POSItemsHolder'
import POSOrderRowHolder from './POSHolder/POSOrderRowHolder'
import { ComboBoxProvider } from '@/components/ComboBox/ComboBoxProvider'

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
    const [customer, setCustomer] = useState<any>(null)
    const POS: any = usePOS()

    // useEffect(() => {
    //     console.log(`POS Products: `, POS.products)
    // }, [POS.products])

    return (
        <>
            <div className='flex p-2 bg-slate-200'>
                <ComboBoxProvider returnLabel setValue={setCustomer}>
                    <button className='p-2 bg-red-800 text-white rounded'>{customer? customer : "Customer"}</button>
                </ComboBoxProvider>
            </div>
            <div className="flex gap-2 min-h-screen">
                <div className='w-[40%] text-ellipsis overflow-hidden whitespace-nowrap p-2 bg-slate-200'>
                    <POSItemsHolder products={props.products} selectedProduct={selectedProduct} setSelectedProduct={setSelectedProduct} />
                </div>
                <div className='w-[60%] text-ellipsis overflow-hidden whitespace-nowrap p-2 bg-slate-200'>
                    <POSOrderRowHolder />
                </div>
            </div>
        </>
    )
}

export default POSHolder
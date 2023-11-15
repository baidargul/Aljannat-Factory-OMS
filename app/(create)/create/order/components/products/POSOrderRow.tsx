'use client'
import { Input } from '@/components/ui/input'
import { usePOS } from '@/hooks/usePOS'
import { formalizeText } from '@/lib/my'
import React, { use, useEffect, useState } from 'react'

type Props = {
    item: any
    index: number
    products: any
    setProducts: any
}

const POSOrderRow = (props: Props) => {
    const POS: any = usePOS()
    const [weight, setWeight] = useState<number>(getWeight())
    const [amount, setAmount] = useState<number>(getAmount())

    function getWeight() {
        let tempWeight = 0
        POS.products.forEach((item: any) => {
            if (item.id === props.item.id) {
                tempWeight = item.weight
            }
        })
        return tempWeight
    }

    function getAmount() {
        let tempAmount = 0
        POS.products.forEach((item: any) => {
            if (item.id === props.item.id) {
                tempAmount = item.amount
            }
        })
        return tempAmount
    }

    const handleWeightChange = (e: any) => {
        setWeight(e.target.value)
        // POS.changeWeight(props.item.id, e.target.value)
    }

    const handleAmountChange = (e: any) => {
        setAmount(e.target.value)
        // POS.changeAmount(props.item.id, e.target.value)
    }

   useEffect(() => {
    let tempProducts = [...props.products]
    tempProducts.forEach((item: any) => {
        if (item.id === props.item.id) {
            item.weight = weight
            item.amount = amount
        }
    })
   },[weight,amount, props])


    return (
        <div className='p-2 relative group bg-slate-50 border-b hover:bg-yellow-100'>
            <div className='grid grid-cols-5 items-center gap-2'>
                <div className='w-4 opacity-20'>{props.index + 1}</div>
                <div>
                    {formalizeText(props.item.productName)}
                </div>
                <div>
                    {formalizeText(props.item.variantName)}
                </div>
                <div>
                    <Input className='text-sm' type='number' placeholder='0.5' onChange={handleWeightChange} value={weight} />
                </div>
                <div>
                    <Input className='text-sm' type='number' placeholder='Rs ' onChange={handleAmountChange} value={amount} />
                </div>
            </div>
            <button onClick={() => POS.removeProduct(props.item.id)} className='group-hover:block group-active:block hidden absolute top-2 left-8 bg-red-800 text-white rounded-md w-6 h-6 text-center cursor-pointer'>x</button>
        </div>
    )
}

export default POSOrderRow
'use client'
import { usePOS } from '@/hooks/usePOS'
import React, { useEffect } from 'react'

type Props = {
    isChanged: boolean
    setIsChanged: any
    POS: any
}

const POSRowsSummary = (props: Props) => {
    const [totalAmount, setTotalAmount] = React.useState<number>(0)
    const POS: any = props.POS

    useEffect(() => {
        // if(props.isChanged) {
        setTotalAmount(POS.getTotalAmount())
        props.setIsChanged(false)
        // }
    }, [props.isChanged, POS, props])

    return (
        <div className='flex justify-between items-center p-2 bg-zinc-800 text-white text-sm'>
            <div>
                Items: {POS.products.length} ({POS.getTotalWeight()} kg)
            </div>
            <div>
                Rs {totalAmount}
            </div>
        </div>
    )
}

export default POSRowsSummary
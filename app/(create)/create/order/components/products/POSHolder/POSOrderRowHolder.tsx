'use client'
import { ScrollArea } from '@/components/ui/scroll-area'
import React, { useEffect } from 'react'
import { v4 } from 'uuid'
import POSOrderRow from '../POSOrderRow'
import POSRowsSummary from '../POSRowsSummary'
import { usePOS } from '@/hooks/usePOS'

type Props = {
}

const POSOrderRowHolder = (props: Props) => {
    const [isChanged, setIsChanged] = React.useState<boolean>(false)
    const [totalAmount, setTotalAmount] = React.useState<number>(0)
    const POS: any = usePOS()
    const getTotalAmount = usePOS((state:any)=>state.getTotalAmount)

    useEffect(() => {
        getTotalAmount()
        setTotalAmount(POS.getTotalAmount())
    }, [isChanged, getTotalAmount, POS.totalAmount])
    return (
        <div>
            {
                POS.products && (
                    <div className=' bg-slate-200 p-2 min-h-screen flex flex-col'>
                        <div className='grid grid-cols-5 items-center gap-2 bg-zinc-800 text-white p-2 font-semibold'>
                            <p>#</p>
                            <p>Product</p>
                            <p>Variation</p>
                            <p>Weight (KG)</p>
                            <p>Amount</p>
                        </div>
                        <div className='border border-zinc-800/40'>
                            <ScrollArea className='h-[500px]'>
                                {
                                    POS.products.map((item: any, index: number) => {
                                        return (
                                            <div key={v4()}>
                                                <POSOrderRow setIsChanged={setIsChanged} index={index} item={item} />
                                            </div>
                                        )
                                    })
                                }
                            </ScrollArea>
                        </div>
                        <POSRowsSummary setIsChanged={setIsChanged} isChanged={isChanged} />
                    </div>
                )
            }
        </div>
    )
}

export default POSOrderRowHolder
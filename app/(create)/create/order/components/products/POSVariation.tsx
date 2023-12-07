import { usePOS } from '@/hooks/usePOS'
import { formalizeText } from '@/lib/my'
import Image from 'next/image'
import React from 'react'
import { v4 } from 'uuid'

type Props = {
    variation: any
    setSelectedProduct: any
    selectedProduct: any

}

const POSVariation = (props: Props) => {
    const POS: any = usePOS()

    function handleItemClick() {
        POS.addProduct(v4(), props.selectedProduct.name, props.variation.name, props.variation.defaultWeight, props.variation.defaultAmount, props.variation.defaultUnit)
        props.setSelectedProduct(null)
    }
    return (
        <div onClick={handleItemClick} className='p-2 bg-slate-200 border-slate-300 hover:bg-slate-100 hover:border-slate-300 active:bg-slate-300 border'>
            <div className='flex gap-2'>
                <Image src={props.variation.imageUrl ? props.variation.imageUrl : '/Placeholders/question.png'} className='w-16 h-16 rounded' width={100} height={100} alt={props.variation.name} />
                <div className='text-ellipsis overflow-hidden whitespace-nowrap font-semibold tracking-wide'>
                    <div>
                        {formalizeText(props.variation.name)}
                    </div>
                    <div className='flex flex-col gap-1 text-xs opacity-60 font-semibold'>
                        <div>
                            {props.variation.defaultWeight} {props.variation.defaultUnit} @ Rs {props.variation.defaultAmount}.0/-
                        </div>
                        <div>

                        </div>
                    </div>
                </div>
            </div>

        </div>
    )
}

export default POSVariation
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
    const POS:any = usePOS()

    function handleItemClick() {
        POS.addProduct(v4(), props.selectedProduct.name, props.variation.name, props.variation.defaultWeight,props.variation.defaultAmount, props.variation.defaultUnit)
        props.setSelectedProduct(null)
    }
    return (
        <div onClick={handleItemClick} className='p-2 bg-slate-200 border-slate-300 hover:bg-slate-100 hover:border-slate-300 active:bg-slate-300 border'>
            <div className='flex gap-2'>
                <Image className='rounded-md' src='https://www.vegrecipesofindia.com/wp-content/uploads/2014/07/suji-halwa-recipe.jpg' alt={props.variation.name} width={80} height={80} />
                <div className='text-ellipsis overflow-hidden whitespace-nowrap'>
                    {formalizeText(props.variation.name)}
                </div>
            </div>
        </div>
    )
}

export default POSVariation
import React from 'react'
import GenericRow from './GenericRow'
import GenericRowsHolder from './GenericRowsHolder'

type Props = {
    orders: any
}

const GenericGrid = (props: Props) => {
    const orders = props.orders
    return (
        <div className='w-full border border-slate-400 rounded-md h-[550px]'>
           <GenericRowsHolder orders={orders}/>
        </div>
    )
}

export default GenericGrid

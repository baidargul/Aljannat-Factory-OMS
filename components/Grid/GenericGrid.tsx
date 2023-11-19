import React from 'react'
import GenericRow from './GenericRow'
import GenericRowsHolder from './GenericRowsHolder'

type Props = {
    orders: any
}

const GenericGrid = (props: Props) => {
    const orders = props.orders
    return (
        <div className='w-full'>
           <GenericRowsHolder orders={orders}/>
        </div>
    )
}

export default GenericGrid

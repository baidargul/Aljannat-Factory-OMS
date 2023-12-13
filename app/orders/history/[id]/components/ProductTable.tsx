'use client'
import React, { useEffect } from 'react'

type Props = {
    order: any
}

const ProductTable = (props: Props) => {
    const [order, setOrder] = React.useState<any>(props.order)
    const [isMounted, setIsMounted] = React.useState<boolean>(false)
    React.useEffect(() => {
        setOrder(props.order)
    }, [props.order])

    useEffect(() => {
        setIsMounted(true)
    }, [])
    return (
        isMounted && (
            <table className='border border-slate-300'>
                <thead className='bg-slate-300'>
                    <tr className=''>
                        <th className='text-start p-2 border-l border-slate-400/50'>Product</th>
                        <th className='text-start p-2 border-l border-slate-400/50'>Variant</th>
                        <th className='text-start p-2 border-l border-slate-400/50'>Weight</th>
                        <th className='text-start p-2 border-l border-slate-400/50'>Amount</th>
                    </tr>
                </thead>
                <tbody className='p-2'>
                    {
                        order && order.ordersRegister.map((orderRegister: any) => (
                            <tr className='border border-b border-slate-300 tracking-tighter'>
                                <td className='p-2 border-l border-slate-300'>{String(orderRegister.product.name).toLocaleUpperCase()}</td>
                                <td className='p-2 border-l border-slate-300'>{String(orderRegister.productVariations?.name).toLocaleUpperCase()}</td>
                                <td className='p-2 border-l border-slate-300'>{orderRegister.weight + " " + String(orderRegister.productVariations.defaultUnit).toLocaleUpperCase()}</td>
                                <td className='p-2 border-l border-slate-300'>{"Rs " + String(orderRegister.amount).toLocaleUpperCase()}</td>
                            </tr>
                        ))

                    }
                </tbody>
            </table>
        )
    )
}

export default ProductTable
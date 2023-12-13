'use client'
import React, { useEffect } from 'react'

type Props = {
    order: any
}

const ProductTable = (props: Props) => {
    const [order, setOrder] = React.useState<any>(props.order)
    const [totalAmount, setTotalAmount] = React.useState<number>(0)
    const [isMounted, setIsMounted] = React.useState<boolean>(false)
    React.useEffect(() => {
        setOrder(props.order)
    }, [props.order])

    useEffect(() => {
        setIsMounted(true)
    }, [])

    let Amount = 0

    return (
        isMounted && (
            <div className='border border-slate-300 w-full'>
                <table className='border border-slate-300 w-full'>
                    <thead className='bg-slate-300 w-full'>
                        <tr className=''>
                            <th className='text-start p-2 border-l border-slate-400/50'>Product</th>
                            <th className='text-start p-2 border-l border-slate-400/50'>Variant</th>
                            <th className='text-start p-2 border-l border-slate-400/50'>Weight</th>
                            <th className='text-start p-2 border-l border-slate-400/50'>Amount</th>
                        </tr>
                    </thead>
                    <tbody className='p-2'>
                        {
                            order && order.ordersRegister.map((orderRegister: any) => {
                                Amount = Amount + Number(orderRegister.amount)
                                return (
                                    <tr className='border border-b border-slate-300 tracking-tighter'>
                                        <td className='p-2 border-l border-slate-300'>{String(orderRegister.product.name).toLocaleUpperCase()}</td>
                                        <td className='p-2 border-l border-slate-300'>{String(orderRegister.productVariations?.name).toLocaleUpperCase()}</td>
                                        <td className='p-2 border-l border-slate-300'>{orderRegister.weight + " " + String(orderRegister.productVariations.defaultUnit).toLocaleUpperCase()}</td>
                                        <td className='p-2 border-l border-slate-300 text-right'>{"Rs " + String(orderRegister.amount).toLocaleUpperCase()}</td>
                                    </tr>
                                )
                            })
                        }
                    </tbody>
                </table>
                <div className='p-2 border-b border-l border-r border-slate-300 tracking-tighter flex justify-end'>Rs {Amount}</div>
            </div>
        )
    )
}

export default ProductTable
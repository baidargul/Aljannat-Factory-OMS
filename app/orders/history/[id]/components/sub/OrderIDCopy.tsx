'use client'
import { Copy } from 'lucide-react';
import React from 'react'
import { toast } from 'sonner';

type Props = {
    order: any
}

const OrderIDCopy = (props: Props) => {
    function orderIdClicked(orderId: string) {
        navigator.clipboard.writeText(orderId)
            .then(() => {
                toast
                    .success("Order reference number copied to clipboard")
            })
            .catch((err) => {
                toast.error("Unable to copy order reference to clipboard")
            });
    }
    return (
        <div onClick={() => orderIdClicked(props.order.id)} className=' group cursor-pointer flex items-center gap-1'>
            <Copy className=' text-slate-500 group-hover:rotate-180 transition-all opacity-0 duration-500 group-hover:opacity-100' size={16} />
            <div className='text-sm uppercase tracking-tighter bg-yellow-50'>
                {props.order.id}
            </div>
        </div>
    )
}

export default OrderIDCopy
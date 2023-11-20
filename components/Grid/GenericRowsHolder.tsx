import React from 'react'
import GenericRow from './GenericRow'
import { ScrollArea } from "@/components/ui/scroll-area"

type Props = {
    orders: any

}

const GenericRowsHolder = (props: Props) => {


    return (
        <>
            <div className='text-sm my-2'>Jobs: {props.orders.length}</div>
            <div className='border border-red-800'>
                <div className='grid grid-cols-9 tracking-wide text-sm justify-items-start bg-red-800 text-white border-red-800 border p-2'>
                    <div>#</div>
                    <div>Job Created</div>
                    <div>Customer</div>
                    <div>Product</div>
                    <div>Weight</div>
                    <div>City</div>
                    <div>Bill</div>
                    <div>Status</div>
                    <div>Courier#</div>
                </div>
                <ScrollArea className='w-full h-[550px]'>
                    <div className=''>
                        {
                            props.orders.length > 0 && props.orders.map((row: any, index: number) => (
                                <div key={row.id} className=''>
                                    <GenericRow row={row} index={index} />
                                </div>
                            ))
                        }
                    </div>
                </ScrollArea>
            </div>
        </>
    )
}

export default GenericRowsHolder
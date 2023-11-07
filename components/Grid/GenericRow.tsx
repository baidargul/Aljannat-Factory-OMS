'use client'
import React, { useState } from 'react'
import SheetProvider from '../SheetProvider/SheetProvider'

type Props = {
    row: any
}

const GenericRow = (props: Props) => {
    const [selectedOrder, setSelectedOrder] = useState<any>(null)

    const { row } = props

    const handleRowClick = () => {
        setSelectedOrder(row)
    }

    function DataRow() {

        return (
            <div className='p-2 grid grid-cols-8 w-full justify-items-start gap-10 text-xs text-start border select-none' onClick={handleRowClick}>
                <div className='w-36 overflow-hidden whitespace-nowrap text-ellipsis '>
                    {
                        row.dateOfBooking.toDateString()
                    }
                </div>
                <div className='font-semibold w-36 overflow-hidden whitespace-nowrap text-ellipsis'>
                    {
                        row.product.charAt(0).toUpperCase() + row.product.slice(1).toLowerCase()
                    }
                </div>
                <div className={`${row.weight && "opacity-100"} opacity-40 w-36 overflow-hidden whitespace-nowrap text-ellipsis`}>
                    {
                        row.weight ? String(row.weight).toLocaleUpperCase() : "0KG"
                    }
                </div>
                <div className='w-36 overflow-hidden whitespace-nowrap text-ellipsis'>
                    {
                        row.variant.charAt(0).toUpperCase() + row.variant.slice(1).toLowerCase()
                    }
                </div>

                <div className='w-36 overflow-hidden whitespace-nowrap text-ellipsis'>
                    {
                        row.customers.name.charAt(0).toUpperCase() + row.customers.name.slice(1).toLowerCase()
                    }
                </div>
                <div className='w-36 overflow-hidden whitespace-nowrap text-ellipsis'>
                    {
                        row.customers.phone
                    }
                </div>
                <div className='w-36 overflow-hidden whitespace-nowrap text-ellipsis'>
                    {
                        row.customers.phone2
                    }
                </div>
                <div className='w-36 overflow-hidden whitespace-nowrap text-ellipsis'>
                    {
                        row.note
                    }
                </div>
            </div>

        )
    }

    console.log(row)
    const title = `${row.weight ? String(row.weight).toLocaleUpperCase() : "0KG"} ${row.product.charAt(0).toUpperCase() + row.product.slice(1).toLowerCase()}   (${row.variant.charAt(0).toUpperCase() + row.variant.slice(1).toLowerCase()})`
    return (
        <SheetProvider trigger={DataRow()}>
            <div className='select-none mt-10 flex flex-col p-2  gap-2'>
                <div className='bg-yellow-300 rounded-md flex p-2 gap-2 w-full justify-evenly'>
                    <p className='text-red-900'>
                        {row.weight ? String(row.weight).toLocaleUpperCase() : "0KG"}
                    </p>
                    <p className=''>
                        {row.product}
                    </p>
                    <p className='text-red-900'>
                        {row.variant}
                    </p>
                </div>
                <div className=''>
                    <div className='flex gap-2'>
                        <p className='font-semibold'>
                            Customer:
                        </p>
                        <p className='tracking-tight'>
                            {row.customers.name.charAt(0).toUpperCase() + row.customers.name.slice(1).toLowerCase()}
                        </p>
                    </div>
                    <div className='flex gap-2 items-center'>
                        <p className='font-semibold'>
                            Phone:
                        </p>
                        <p className='tracking-tight text-sm'>
                            {row.customers.phone}
                        </p>
                        <p className='tracking-tight text-sm'>
                            ({row.customers.phone2})
                        </p>
                    </div>
                </div>
            </div>
        </SheetProvider>

    )
}

export default GenericRow
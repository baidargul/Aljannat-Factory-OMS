'use client'
import React, { useEffect } from 'react'
import { DatePicker } from '../DatePicker/DatePicker'
import { formalizeText } from '@/lib/my'
import { ScrollArea } from '../ui/scroll-area'
import GenericRow from './GenericRow'

type Props = {
    orders: any
    profile: any
}

const GridWithFilters = (props: Props) => {
    const [isMounted, setIsMounted] = React.useState(false)
    const [fromDate, setFromDate] = React.useState(new Date())
    const [toDate, setToDate] = React.useState(new Date())


    useEffect(() => {
        setIsMounted(true)
    },[])

    useEffect(() => {
        setFromDate(new Date(new Date().setDate(new Date().getDate() - 1)))
        setToDate(new Date())
    }, [isMounted])

    let totalWeight = 0
    props.orders.map((order: any) => {
        order.ordersRegister.map((register: any) => {
            totalWeight = totalWeight + register.weight
        })
    })
    return (
        <div className=''>
            <div className='flex gap-2 w-full my-2'>
                <DatePicker setValue={setFromDate}>
                    <button>
                        <div className='text-sm flex gap-1 w-44'>
                            <div className='font-semibold'>From:</div>
                            <div className='border-b border-red-800/40'>{fromDate ? formalizeText((fromDate?.toDateString())) : ""}</div>
                        </div>
                    </button>
                </DatePicker>
                <DatePicker setValue={setToDate}>
                    <button>
                        <div className='text-sm flex gap-1 w-44'>
                            <div className='font-semibold'>To:</div>
                            <div className='border-b border-red-800/40'>{toDate ? formalizeText((toDate?.toDateString())) : ""}</div>
                        </div>
                    </button>
                </DatePicker>
            </div>
            <div className='border border-red-800 w-full'>
                <div className='grid grid-cols-9 w-full tracking-wide text-sm justify-items-start bg-red-800 text-white border-red-800 border p-2'>
                    <div>#</div>
                    <div>Job Created</div>
                    <div>Customer</div>
                    <div>Product</div>
                    <div>({totalWeight}) Weight</div>
                    <div>City</div>
                    <div>Bill</div>
                    <div>Status</div>
                    <div>Courier#</div>
                </div>
                <ScrollArea className='w-full h-[550px]'>
                    <div className='w-full'>
                        {
                            props.orders.length > 0 && props.orders.map((row: any, index: number) => {
                                if (row.dateOfBooking < fromDate || row.dateOfBooking > toDate) {
                                    return null
                                }
                                return (
                                    <div key={row.id} className=''>
                                        <GenericRow stage='orderVerification' row={row} index={index} profile={props.profile} />
                                    </div>
                                )
                            })
                        }
                    </div>
                </ScrollArea>
            </div>
        </div>
    )
}

export default GridWithFilters
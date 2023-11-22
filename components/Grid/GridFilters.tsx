'use client'
import React, { useEffect } from 'react'
import { DatePicker } from '../DatePicker/DatePicker'
import { formalizeText } from '@/lib/my'
import { ScrollArea } from '../ui/scroll-area'
import GenericRow from './GenericRow'
import { ComboBoxProvider } from '../ComboBox/ComboBoxProvider'

type Props = {
    orders: any
    profile: any
    availableCities: availableCity[]
}

type availableCity = {
    name: String
    label: String
}

const GridWithFilters = (props: Props) => {
    const [isMounted, setIsMounted] = React.useState(false)
    const [fromDate, setFromDate] = React.useState(new Date())
    const [toDate, setToDate] = React.useState(new Date())
    const [cityFilter, setCityFilter] = React.useState(null)


    useEffect(() => {
        setIsMounted(true)
    }, [])

    useEffect(() => {
        setFromDate(new Date(new Date().setDate(new Date().getDate() - 1)))
        setToDate(new Date())
    }, [isMounted])

    let totalWeight: number = 0.0;

    props.orders.map((order: any) => {
        order.ordersRegister.map((register: any) => {
            const orderDate = new Date(order.dateOfBooking);

            if (orderDate >= fromDate && orderDate <= toDate) {
                if (cityFilter && String(cityFilter).toLocaleLowerCase() === String(order.customers.city).toLocaleLowerCase()) {
                    totalWeight += Number(register.weight);
                }
                if (!cityFilter) {
                    totalWeight += Number(register.weight);
                }
            }
        });
    });

    return (
        <div className=''>
            <div className='flex gap-2 w-full my-2 justify-end items-center'>
                <div>
                    <ComboBoxProvider setValue={setCityFilter} content={props.availableCities}>
                        <div className={`relative`}>
                            <div onClick={() => setCityFilter(null)} className={`absolute top-[8px] ${cityFilter === null && "hidden"} flex left-2 bg-slate-400 border border-slate-500 font-semibold  items-center justify-center text-sm opacity-60 hover:opacity-100 w-4 h-4 text-white`}>
                                <p className=''>
                                    x
                                </p>
                            </div>
                            <div className='bg-slate-100 border-slate-200 border-t-2 text-sm p-1 rounded-md w-36 text-center'>
                                {cityFilter ? formalizeText(cityFilter) : "Select city"}
                            </div>
                        </div>
                    </ComboBoxProvider>
                </div>
                <DatePicker setValue={setFromDate}>
                    <button>
                        <div className='text-sm text-right flex gap-1 w-40'>
                            <div className='font-semibold'>From:</div>
                            <div className='border-b border-red-800/40'>{fromDate ? formalizeText((fromDate?.toDateString())) : ""}</div>
                        </div>
                    </button>
                </DatePicker>
                <DatePicker setValue={setToDate}>
                    <button>
                        <div className='text-sm text-right flex gap-1 w-40'>
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

                                if (String(row.customers.city).toLocaleLowerCase() !== String(cityFilter).toLocaleLowerCase() && cityFilter !== null) {
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
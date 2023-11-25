'use client'
import React, { useEffect } from 'react'
import { DatePicker } from '../DatePicker/DatePicker'
import { formalizeText } from '@/lib/my'
import { ScrollArea } from '../ui/scroll-area'
import GenericRow from './GenericRow'
import { ComboBoxProvider } from '../ComboBox/ComboBoxProvider'
import { Role, Status } from '@prisma/client'

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
        setFromDate(new Date(new Date()))
        setToDate(new Date(new Date().setDate(new Date().getDate() + 1)));
    }, [isMounted])

    let totalWeight: number = 0.0;
    let totalBill: number = 0.0;
    let totalDays: number = 0;
    let totalPending: number = 0;
    if (fromDate && toDate) {
        if (!fromDate || !toDate) return
        totalDays = Math.floor((toDate.getTime() - fromDate.getTime()) / (1000 * 3600 * 24));
    }

    props.orders.map((order: any) => {

        order.ordersRegister.map((register: any) => {
            const orderDate = new Date(order.dateOfBooking);

            totalDays = Math.floor((toDate.getTime() - fromDate.getTime()) / (1000 * 3600 * 24));

            if (orderDate >= fromDate && orderDate <= toDate) {
                if (cityFilter && String(cityFilter).toLocaleLowerCase() === String(order.customers.city).toLocaleLowerCase()) {
                    if (String(order.status).toLocaleLowerCase() === 'booked') {
                        totalPending += 1;
                    }
                    totalWeight += Number(register.weight);
                    totalBill += Number(register.amount);
                }
                if (!cityFilter) {
                    if (String(order.status).toLocaleLowerCase() === 'booked') {
                        totalPending += 1;
                    }
                    totalWeight += Number(register.weight);
                    totalBill += Number(register.amount);
                }
            }
        });
    });

    return (
        isMounted && <div className=''>
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
                <div>
                    <div className='text-xs text-slate-400 -my-1'>Range: {totalDays} {totalDays > 1 ? "days." : totalDays < 0 ? "Invalid date range." : "day."}</div>
                    <DatePicker setValue={setFromDate} defaultValue={fromDate}>
                        <button>
                            <div className='text-sm text-right flex gap-1 w-40'>
                                <div className='font-semibold'>From:</div>
                                <div className='border-b border-red-800/40'>{fromDate ? formalizeText((fromDate?.toDateString())) : ""}</div>
                            </div>
                        </button>
                    </DatePicker>
                    <DatePicker setValue={setToDate} defaultValue={toDate}>
                        <button>
                            <div className='text-sm text-right flex gap-1 w-40'>
                                <div className='font-semibold'>To:</div>
                                <div className='border-b border-red-800/40'>{toDate ? formalizeText((toDate?.toDateString())) : ""}</div>
                            </div>
                        </button>
                    </DatePicker>
                </div>
            </div>
            <div className='border border-red-800 w-full'>
                <div className='grid grid-cols-9 w-full tracking-wide text-sm justify-items-start bg-red-800 text-white border-red-800 border p-2'>
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
                    <div className='w-full'>
                        {
                            fromDate && toDate && props.orders.length > 0 && props.orders.map((row: any, index: number) => {
                                let stage = getStage(props.profile.role) || 'orderVerification';
                                switch (props.profile.role.toLocaleUpperCase()) {
                                    case Role.ADMIN:
                                        break;

                                    case Role.MANAGER:
                                        break;

                                    case Role.ORDERBOOKER:
                                        if (String(row.status).toLocaleUpperCase() === Status.BOOKED)
                                            return;
                                        break;

                                    case Role.ORDERVERIFIER:
                                        if (String(row.status).toLocaleUpperCase() !== Status.BOOKED)
                                            return;
                                        break;

                                    case Role.PAYMENTVERIFIER:
                                        if (String(row.status).toLocaleUpperCase() !== Status.VERIFIEDORDER)
                                            return null;
                                    case Role.DISPATCHER:
                                        if (String(row.status).toLocaleUpperCase() !== Status.PAYMENTVERIFIED)
                                            return null;
                                    case Role.SUPERADMIN:
                                        break;

                                    default:
                                        break;
                                }


                                const bookingDate = new Date(row.dateOfBooking);
                                const startOfDayFromDate = new Date(fromDate);
                                startOfDayFromDate.setHours(0, 0, 0, 0);

                                const endOfDayToDate = new Date(toDate);
                                endOfDayToDate.setHours(23, 59, 59, 999);

                                if (bookingDate < startOfDayFromDate || bookingDate > endOfDayToDate) {
                                    return null;
                                }

                                if (String(row.customers.city).toLocaleLowerCase() !== String(cityFilter).toLocaleLowerCase() && cityFilter !== null) {
                                    return null
                                }
                                return (
                                    <div key={row.id} className=''>
                                        <GenericRow stage={stage} row={row} index={index} profile={props.profile} />
                                    </div>
                                )
                            })
                        }
                    </div>
                </ScrollArea>
            </div>
            <div className='text-xs grid grid-cols-2'>
                <div className="flex gap-1 py-1 items-center">
                    {/* <p className="">
                        Pending orders:
                    </p>
                    <p>
                        {totalPending}
                    </p> */}
                </div>

            </div>
        </div>
    )
}

export default GridWithFilters

function getStage(role: Role){
    switch (role) {
        case Role.ADMIN:
            break;

        case Role.MANAGER:
            break;

        case Role.ORDERBOOKER:
            break;

        case Role.ORDERVERIFIER:
            return 'orderVerification'

        case Role.PAYMENTVERIFIER:
            return 'paymentVerification'
        case Role.DISPATCHER:
            return 'dispatchDivision'
        case Role.SUPERADMIN:
            break;

        default:
            break;
    }
}
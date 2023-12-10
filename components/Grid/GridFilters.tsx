'use client'
import React, { useEffect } from 'react'
import { DatePicker } from '../DatePicker/DatePicker'
import { formalizeText } from '@/lib/my'
import { ScrollArea } from '../ui/scroll-area'
import GenericRow from './GenericRow'
import { ComboBoxProvider } from '../ComboBox/ComboBoxProvider'
import { Role, Status } from '@prisma/client'
import { v4 } from 'uuid'
import { CalendarCheck, CalendarDays, CheckSquare, MousePointer, Tally5, Truck, User } from 'lucide-react'
import ToolTipProvider from '../ToolTipProvider/ToolTipProvider'
import axios from 'axios'
import { toast } from 'sonner'
import { useRouter } from 'next/navigation'
import { Setting_FETCH } from '@/lib/settings'
import TimeRemainingToRefresh from './components/GridFilters/TimeRemainingToRefresh'
import HoverCardProvider from '../HoverCardProvider/HoverCardProvider'
import SelectionActions from './components/GridFilters/SelectionActions/SelectionActions'

type Props = {
    orders: any
    profile: any
    availableCities: availableCity[]
}

type availableCity = {
    name: String
    label: String
}

type Mode = 'normal' | 'selection'

const GridWithFilters = (props: Props) => {
    const [isMounted, setIsMounted] = React.useState(false)
    const [fromDate, setFromDate] = React.useState(new Date())
    const [toDate, setToDate] = React.useState(new Date())
    const [cityFilter, setCityFilter] = React.useState(null)
    const [orders, setOrders] = React.useState(props.orders)
    const [refreshRate, setRefreshRate] = React.useState(30000)
    const [selectedOrders, setSelectedOrders] = React.useState<any>([])
    const [mode, setMode] = React.useState<Mode>('normal')
    const router = useRouter()

    async function getOrders(setOrders: any, router: any) {
        let response = null;

        await axios.get('/api/order/all').then(async (res) => {
            response = await res.data;
            if (response.status === 200) {
                setOrders(response.data)
            } else {
                toast.error(response.message)
                router.push('/')
            }
        })
    }

    function addToSelection(orderId: string) {
        if (selectedOrders.length === 0) {
            setSelectedOrders([orderId])
            return
        } else {
            const index = selectedOrders.findIndex((id: string) => id === orderId)
            if (index === -1) {
                setSelectedOrders([...selectedOrders, orderId])
            } else {
                const newSelection = selectedOrders.filter((id: string) => id !== orderId)
                setSelectedOrders(newSelection)
            }
        }
    }

    function removeFromSelection(orderId: string) {
        const index = selectedOrders.findIndex((id: string) => id === orderId)
        if (index !== -1) {
            const newSelection = selectedOrders.filter((id: string) => id !== orderId)
            setSelectedOrders(newSelection)
        }
    }

    function isInSelection(orderId: string) {
        const index = selectedOrders.findIndex((id: string) => id === orderId)
        return index !== -1
    }

    function clearSelection() {
        setSelectedOrders([])
    }

    const selectionProps = { addToSelection, removeFromSelection, isInSelection, clearSelection, mode }

    useEffect(() => {
        setTimeout(() => {
            getOrders(setOrders, router)
        }, refreshRate);
    }, [getOrders, router])

    useEffect(() => {
        setIsMounted(true)
    }, [])

    async function getRefreshRate() {
        if (!isMounted) return
        let response: any = null;

        const data = {
            name: "refreshgrid",
            method: "READ"
        }

        try {
            await axios.post(`/api/settings/get/`, data).then(async (res) => {
                response = await res.data
                response.status = response.status
                response.message = response.message
                response.data = response.data
            }).catch((err) => {
                response.status = 500
                response.message = err.message
                response.data = null
            }).finally(() => {
                if (response.status === 200) {
                    setRefreshRate(response.data.value1 * 1000)
                }
            })
        } catch (error: any) {
            toast.error(error.message)
        }

    }

    useEffect(() => {
        getRefreshRate()
    }, [isMounted])

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

    orders.map((order: any) => {

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
            <div className='flex justify-between items-center gap-2'>
                <div className='text-slate-400 text-xs flex w-24'>
                    <TimeRemainingToRefresh refreshRate={refreshRate} />
                </div>
                <HoverCardProvider content={<SelectionActions selectionProps={selectionProps} />}>
                    <div className='relative'>
                        <div onClick={() => clearSelection()} className={`absolute z-10 ${selectedOrders.length < 1 && "hidden"} flex -top-1 -left-2 bg-slate-400 border border-slate-500 font-semibold  items-center justify-center text-sm opacity-60 hover:opacity-100 w-4 h-4 text-white`}>
                            <p className=''>
                                x
                            </p>
                        </div>
                        <button onClick={() => setMode(mode === 'normal' ? 'selection' : 'normal')} className='text-xs w-28 flex gap-1 justify-center items-center bg-slate-100 hover:bg-slate-50 drop-shadow-sm p-1 border rounded-md'>
                            {mode === 'normal' && <MousePointer className='text-xs w-4 h-4' />}
                            {mode === "selection" && <CheckSquare className='text-xs w-4 h-4' />}
                            {formalizeText(mode)}
                        </button>
                    </div>
                </HoverCardProvider>

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
                        <div className='flex gap-1'>
                            <DatePicker setValue={setFromDate} defaultValue={fromDate}>
                                <div className='cursor-pointer'>
                                    <div className='text-sm text-right flex gap-1 w-44'>
                                        <div className='font-semibold'>From:</div>
                                        <div className='border-b border-slate-400'>{fromDate ? formalizeText((fromDate?.toDateString())) : ""}</div>
                                    </div>
                                </div>
                            </DatePicker>
                            <DatePicker setValue={setToDate} defaultValue={toDate}>
                                <div className='cursor-pointer'>
                                    <div className='text-sm text-right flex gap-1 w-44'>
                                        <div className='font-semibold'>To:</div>
                                        <div className='border-b border-slate-400'>{toDate ? formalizeText((toDate?.toDateString())) : ""}</div>
                                    </div>
                                </div>
                            </DatePicker>
                        </div>
                    </div>
                </div>
            </div>

            <div className='border border-slate-400 w-full'>
                <div className='grid grid-cols-10 w-full tracking-wide text-sm items-center justify-items-start bg-slate-400 text-zinc-800 border-slate-400 border p-2'>
                    <div>
                        <ToolTipProvider content='Order#'>
                            <Tally5 className='text-sm' />
                        </ToolTipProvider>
                    </div>
                    <div className='ml-auto mr-auto'>
                        <ToolTipProvider content='Date of booking'>
                            <CalendarDays className='text-sm' />
                        </ToolTipProvider>
                    </div>
                    <div className='ml-auto mr-auto'>
                        <ToolTipProvider content='To be delivered'>
                            <CalendarCheck className='text-sm' />
                        </ToolTipProvider>
                    </div>
                    <div>
                        <ToolTipProvider content='Customer'>
                            <User className='text-sm' />
                        </ToolTipProvider>
                    </div>
                    <div>Product</div>
                    <div>Weight</div>
                    <div>City</div>
                    <div>Bill</div>
                    <div className='ml-auto mr-auto'>Status</div>
                    <div className='ml-auto mr-auto'>
                        <ToolTipProvider content='Courier'>
                            <Truck />
                        </ToolTipProvider>
                    </div>
                </div>
                <ScrollArea className='w-full h-[550px]'>
                    <div className='w-full'>
                        {
                            fromDate && toDate && orders.length > 0 && orders.map((row: any, index: number) => {
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
                                        if (String(row.status).toLocaleUpperCase() !== Status.VERIFIEDORDER) {
                                            return null;
                                        }
                                        break;

                                    case Role.DISPATCHER:
                                        if (String(row.status).toLocaleUpperCase() !== Status.PAYMENTVERIFIED) {
                                            return null;
                                        }
                                        break;

                                    case Role.INVENTORYMANAGER:
                                        if (String(row.status).toLocaleUpperCase() !== Status.READYTODISPATCH) {
                                            return null;
                                        }
                                        break;

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
                                const forNotThisUser = props.profile.userId !== row.userId;



                                return (
                                    <div key={v4()} className={`${forNotThisUser && "opacity-30"}`}>
                                        <GenericRow selectionProps={selectionProps} stage={stage} row={row} index={index} profile={props.profile} disabled={forNotThisUser} />
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
        </div >
    )
}

export default GridWithFilters

function getStage(role: Role) {
    switch (role) {
        case Role.ADMIN:
            break;

        case Role.MANAGER:
            break;

        case Role.ORDERBOOKER:
            return 'orderBooker'
            break;

        case Role.ORDERVERIFIER:
            return 'orderVerification'


        case Role.PAYMENTVERIFIER:
            return 'paymentVerification'
        case Role.DISPATCHER:
            return 'dispatchDivision'

        case Role.INVENTORYMANAGER:
            return 'inventoryManager'

        case Role.SUPERADMIN:
            break;

        default:
            break;
    }
}



'use client'
import { getStatusCasual, getTimeLapsed } from '@/components/Grid/GenericRow'
import ToolTipProvider from '@/components/ToolTipProvider/ToolTipProvider'
import { formalizeText, getCurrentUserCasualStatus, getCurrentUserFormalStatus } from '@/lib/my'
import axios from 'axios'
import Image from 'next/image'
import Link from 'next/link'
import React, { useEffect, useState } from 'react'
import { toast } from 'sonner'

type Props = {
    setWorking?: any
    profile?: any
}

const OrderNotes = (props: Props) => {
    const [profile, setProfile] = useState<any>(props.profile)


    const [orders, setOrders] = useState<any[]>([])

    useEffect(() => {
        getOrders();
        const intervalId = setInterval(() => {
            getOrders();
        }, 5000);

        return () => {
            clearInterval(intervalId);
        };
    }, []);

    async function getOrders() {
        try {
            if (props.setWorking) {
                props.setWorking(true)
            }
            const res = await axios.get('/api/order/notes');
            const data = res.data;

            if (data.status === 200) {
                setOrders(data.data);
            } else {
                setOrders([]);
            }
            if (props.setWorking) {
                props.setWorking(false)
            }
        } catch (err: any) {
            if (props.setWorking) {
                props.setWorking(false)
            }
            toast.error(err.message);
        } finally {
            if (props.setWorking) {
                props.setWorking(false)
            }
        }
    }

    return (
        <div>
            {
                orders.map((order) => {
                    return (
                        <div className={`flex border bg-white py-1 overflow-x-auto ${profile ? profile.userId === order.profile.userId ? "bg-green-50/50" : null : null}`}>
                            <div className='grid grid-cols-3 w-full'>
                                <Link href={`/user/account/${order.profile.userId}`} target='_blank'>
                                    <div className='flex gap-1 items-center'>
                                        <div className='pl-1'>
                                            <Image src={order.profile.imageURL} width={40} height={40} alt='userImage' className='rounded' />
                                        </div>
                                        <div className=''>
                                            <div className={`font-semibold -mb-1 ${profile ? profile.userId === order.profile.userId ? "text-green-500 bg-green-50 w-fit rounded-md" : null : null}`}>
                                                {profile ? profile.userId === order.profile.userId ? "You" : order.profile.name : order.profile.name}
                                            </div>
                                            <div className='text-xs'>
                                                {getCurrentUserCasualStatus(order.profile.role)}
                                            </div>
                                            <div className='text-xs text-slate-500 scale-90 -ml-2 -mt-1'>
                                                {order.profile.email}
                                            </div>
                                        </div>
                                    </div>
                                </Link>
                                <div>
                                    <div className='font-sans'>
                                        <div className='flex gap-1 items-center w-[70%]'>
                                            <div className='truncate cursor-default'>
                                                <ToolTipProvider content={order.note}>
                                                    {order.note}
                                                </ToolTipProvider>
                                            </div>
                                            <div className='text-xs bg-slate-100 text-center p-1 rounded border border-slate-200 animate-pulse'>
                                                {getTimeLapsed((order.createdAt))}
                                            </div>
                                        </div>
                                    </div>
                                    <div className='flex justify-between'>
                                        <div className='tracking-tight'>
                                            {formalizeText(getStatusCasual(order.orders.status))}
                                        </div>
                                        <div>
                                        </div>
                                    </div>
                                </div>
                                <div className='text-xs flex flex-col items-start'>
                                    <div className='border-b border-blue-400 bg-blue-50 uppercase scale-90 -ml-3'>
                                        <Link href={`/orders/history/${order.orders.id}`} target='_blank'>
                                            @ {order.orderId}
                                        </Link>
                                    </div>
                                    <div className='flex gap-1 text-slate-500'>
                                        <div className='font-semibold'>
                                            Booked:
                                        </div>
                                        <div className=''>
                                            {new Date(order.orders.dateOfBooking).toDateString() + " " + new Date(order.orders.dateOfBooking).toLocaleTimeString() + " - " + getTimeLapsed(order.orders.dateOfBooking)}
                                        </div>
                                    </div>
                                    <div className='flex gap-1 text-slate-500'>
                                        <div className='font-semibold'>
                                            Delivery:
                                        </div>
                                        <div>
                                            {new Date(order.orders.dateOfDelivery).toDateString() + " " + new Date(order.orders.dateOfDelivery).toLocaleTimeString()}
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    )

                })
            }
        </div>
    )
}

export default OrderNotes
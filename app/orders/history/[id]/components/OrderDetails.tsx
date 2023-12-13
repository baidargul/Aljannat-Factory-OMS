import { Status } from '@prisma/client'
import React from 'react'

type Props = {
    order: any
}

const OrderDetails = (props: Props) => {
    const order = props.order
    return (
        <div>
            <div className=' mb-24'>

                <div className='font-bold text-2xl uppercase tracking-widest'>
                    Order details
                </div>
                <div className='flex gap-1 text-xs'>
                    <div className='font-bold'>
                        Expected Delivery:
                    </div>
                    <div className='flex gap-1'>
                        <div className='font-semibold'>
                            {new Date(order.dateOfDelivery).toDateString()}
                        </div>
                        <div>
                            {`(${getDeliveryDateDifference(order.dateOfDelivery)})`}
                        </div>
                    </div>
                </div>
            </div>
            <div>
                <div className='flex gap-1 justify-between items-center p-y'>
                    <div className='font-semibold text-slate-700'>
                        Order#
                    </div>
                    <div className='text-sm uppercase tracking-tighter'>
                        {order.id}
                    </div>
                </div>
            </div>
            <div>
                <div className='flex gap-1 justify-between items-center p-y'>
                    <div className='font-semibold text-slate-700'>
                        Customer:
                    </div>
                    <div className='text-sm uppercase tracking-tighter font-semibold'>
                        {order?.customers?.name}
                    </div>
                </div>
            </div>
            <div>
                <div className='flex gap-1 justify-between items-center p-y'>
                    <div className='font-semibold text-slate-700'>
                        Booking:
                    </div>
                    <div className='text-sm uppercase tracking-tighter'>
                        {new Date(order?.createdAt).toDateString()}
                    </div>
                </div>
            </div>
            <div>
                <div className='flex gap-1 justify-between items-center p-y'>
                    <div className='font-semibold text-slate-700'>
                        Last Interaction:
                    </div>
                    <div className='text-sm uppercase tracking-tighter'>
                        {new Date(order.orderNotes[0].createdAt ? order?.orderNotes[0]?.createdAt : "N/A").toDateString()}
                    </div>
                </div>
            </div>
            <div>
                <div className='flex gap-1 justify-between items-center p-y'>
                    <div className='font-semibold text-slate-700'>
                        Status:
                    </div>
                    <div className={'text-sm uppercase tracking-tighter' + rowStatusStyle(order.status ? order.status : "-")}>
                        {getStatusCasual(order?.status)}
                    </div>
                </div>
            </div>
        </div>
    )
}

export default OrderDetails

function rowStatusStyle(status: string) {
    switch (String(status).toLocaleUpperCase()) {
        case Status.READYTODISPATCH:
            return "bg-indigo-100 text-indigo-800";
        case "credit":
            return "bg-green-100 text-green-800";
        case Status.PAYMENTVERIFIED:
            return "bg-green-100 text-green-800 border border-green-300";
        case "delivered":
            return "bg-green-100 text-green-800";
        case "fake":
            return "bg-slate-100 text-slate-800";
        case Status.CANCELLED:
            return "bg-red-100 text-red-500";
        case Status.VERIFIEDORDER:
            return "bg-cyan-100 text-cyan-700";
        case Status.DISPATCHED:
            return "bg-green-100 text-green-700 border-b border-green-700 ";
        default:
            return "bg-yellow-300";
    }
}

function getStatusCasual(status: Status) {
    switch (status) {
        case Status.BOOKED:
            return "BOOKED"
        case Status.VERIFIEDORDER:
            return "VERIFIED ORDER"
        case Status.PAYMENTVERIFIED:
            return "PAYMENT VERIFIED";
        case Status.READYTODISPATCH:
            return "READY FOR DISPATCH";
        case Status.DISPATCHED:
            return "DISPATCHED"
        case Status.CANCELLED:
            return "CANCELLED"
        default:
            return "Unknown"
    }
}

function getDeliveryDateDifference(targetDateTime: any) {
    const target = new Date(targetDateTime);
    const now = new Date();
    const diff = now.getTime() - target.getTime();

    const diffInSeconds = Math.floor(diff / 1000);
    const diffInMinutes = Math.floor(diffInSeconds / 60);
    const diffInHours = Math.floor(diffInMinutes / 60);
    const diffInDays = Math.floor(diffInHours / 24);

    if (diffInDays === 0) {
        return "Today";
    } else if (diffInDays === 1) {
        return "Yesterday";
    } else if (diffInDays < 7) {
        return `${diffInDays} days ago`;
    } else if (diffInDays < 30) {
        const weeks = Math.floor(diffInDays / 7);
        return weeks === 1 ? "1 week ago" : `${weeks} weeks ago`;
    } else if (diffInDays < 365) {
        const months = Math.floor(diffInDays / 30);
        return months === 1 ? "1 month ago" : `${months} months ago`;
    } else {
        const years = Math.floor(diffInDays / 365);
        return years === 1 ? "1 year ago" : `${years} years ago`;
    }
}

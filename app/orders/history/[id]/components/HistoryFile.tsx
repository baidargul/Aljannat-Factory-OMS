'use client'
import { ScrollArea } from '@/components/ui/scroll-area'
import { Role } from '@prisma/client'
import Image from 'next/image'
import React, { useEffect } from 'react'

type Props = {
    order: any
}

const HistoryFile = (props: Props) => {
    const [isMounted, setIsMounted] = React.useState(false)
    const [selectedRow, setSelectedRow] = React.useState("")

    useEffect(() => {
        setIsMounted(true)
    }, [])

    function handleClick(index: string) {
        if (index === selectedRow) {
            setSelectedRow("")
        } else {
            setSelectedRow(index)
        }
    }

    const order = props.order
    return (
        isMounted && <div className='p-1 bg-white'>
            <ScrollArea className='h-[600px] pr-4 bg-white' type='always'>
                {
                    order.orderNotes.map((Note: any, index: number) => {

                        return (
                            <div onClick={() => handleClick(Note.id)} className={`grid grid-cols-2 p-2 even:bg-slate-50 rounded  ${selectedRow === Note.id ? "bg-red-50" : "hover:bg-yellow-50"}`}>

                                <div className='flex gap-2'>
                                    <div className='flex justify-start items-center'>
                                        {
                                            order.orderNotes.length - index === 1 ? <div className='text-xs text-gray-500'>-</div> : <div className='text-xs text-gray-500'>{order.orderNotes.length - index - 1}</div>
                                        }
                                    </div>
                                    <Image src={Note.profile.imageURL} alt='userImage' width={20} height={20} className='w-10 h-10 rounded-md' />
                                    <div className='flex flex-col'>
                                        <div className='font-semibold'>
                                            {Note.profile.name}
                                        </div>
                                        <div className='text-xs tracking-tighter'>
                                            {getStage(Note.profile.role)}
                                        </div>
                                    </div>
                                </div>
                                <div className='flex flex-col justify-end items-end'>
                                    <div className=''>
                                        {Note.note}
                                    </div>
                                    <div className='text-xs flex gap-1 justify-end'>
                                        <div>{new Date(Note.createdAt).toDateString()}</div>
                                        <div>{new Date(Note.createdAt).toLocaleTimeString()}</div>
                                    </div>
                                </div>
                            </div>
                        )
                    }
                    )
                }
            </ScrollArea>
        </div>
    )
}

export default HistoryFile

function getStage(role: Role) {
    switch (role) {
        case Role.ADMIN:
            return 'Admin'
        case Role.MANAGER:
            return 'Manager'
        case Role.ORDERBOOKER:
            return 'Order Booker'
        case Role.ORDERVERIFIER:
            return 'Order Verifier'
        case Role.PAYMENTVERIFIER:
            return 'Payment Verifier'
        case Role.DISPATCHER:
            return 'Dispatcher'
        case Role.INVENTORYMANAGER:
            return 'Inventory Manager'
        case Role.SUPERADMIN:
            return 'Super Admin'

        default:
            break;
    }
}
import currentProfile from '@/lib/current-profile'
import prisma from '@/lib/prisma'
import { redirectToSignIn } from '@clerk/nextjs'
import { Role, Status, profile } from '@prisma/client'
import { redirect } from 'next/navigation'
import React from 'react'
import { toast } from 'sonner'

type Props = {}

const OrdersSummary = async (props: Props) => {
    const profile = await currentProfile()
    if (!profile) {
        redirectToSignIn()
    }

    const olderOrder = await oldestOrderDate()

    return (
        <div className='w-full'>
            <div className='pr-2 flex flex-col gap-1'>
                <section className='flex justify-between text-sm font-semibold font-mono text-slate-600'>
                    <div>
                        Oldest:
                    </div>
                    <div className={`bg-slate-100 px-2 border-b border-slate-300 ${new Date(olderOrder) < new Date() ? "text-orange-700 bg-orange-50 border-orange-700" : ""}`}>
                        {olderOrder}
                    </div>
                </section>
                <section className='flex justify-between text-sm font-semibold font-mono text-slate-600'>
                    <div>
                        In Processing:
                    </div>
                    <div className='bg-slate-200 px-2 rounded border border-slate-300'>
                        {await getOrders()}
                    </div>
                </section>
                <section className='flex justify-between text-sm font-semibold font-mono text-slate-600'>
                    <div>
                        Assigned to me:
                    </div>
                    <div className='bg-slate-200 px-2 rounded border border-slate-300'>
                        {await currentUserOrders(String(profile?.userId))}
                    </div>
                </section>


            </div>
        </div>
    )
}

export default OrdersSummary

function orderStatusforUser(user: profile) {
    const role: Role = user.role;

    switch (role) {
        case Role.ORDERBOOKER:
            return Status.BOOKED;
        case Role.ORDERVERIFIER:
            return Status.BOOKED;
        case Role.PAYMENTVERIFIER:
            return Status.VERIFIEDORDER
        case Role.DISPATCHER:
            return Status.PAYMENTVERIFIED
        case Role.INVENTORYMANAGER:
            return Status.READYTODISPATCH
        default:
            return Status.BOOKED;
    }
}

async function getOrders() {
    const orders = await prisma.orders.findMany({
        where: {
            NOT: {
                status: 'DISPATCHED' || 'CANCELLED'
            }
        }
    })
    return orders.length
}

async function currentUserOrders(userId: string) {
    const orders = await prisma.orders.findMany({
        where: {
            userId: userId,
            NOT: {
                status: 'DISPATCHED' || 'CANCELLED'
            }
        }
    })
    return orders.length
}
async function oldestOrderDate() {
    const orders = await prisma.orders.findMany({
        where: {
            NOT: {
                status: 'DISPATCHED' || 'CANCELLED'
            }
        },
        orderBy: {
            createdAt: 'asc'
        }
    })

    if (orders.length > 0) {
        return new Date(orders[0].createdAt).toDateString()
    } else {
        return 0
    }
}

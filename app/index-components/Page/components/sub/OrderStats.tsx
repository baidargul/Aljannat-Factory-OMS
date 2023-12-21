import currentProfile from '@/lib/current-profile'
import prisma from '@/lib/prisma'
import { redirectToSignIn } from '@clerk/nextjs'
import React from 'react'

type Props = {}

const OrderStats = async (props: Props) => {
    const profile: any = await currentProfile()
    if (!profile) redirectToSignIn()

    let pendingOrders = 0
    let totalOrders = 0
    let totalInterations = 0
    const firstDayOfThisMonth = new Date(new Date().getFullYear(), new Date().getMonth(), 1)
    const lastDayOfThisMonth = new Date(new Date().getFullYear(), new Date().getMonth() + 1, 0)

    let orders = await prisma.orders.findMany({
        where: {
            dateOfBooking: {
                gte: firstDayOfThisMonth,
                lt: lastDayOfThisMonth
            }
        }
    })
    totalOrders = orders.length

    orders = []


    orders = await prisma.orders.findMany({
        where: {
            userId: profile?.userId,
            dateOfBooking: {
                gte: firstDayOfThisMonth,
                lt: lastDayOfThisMonth
            }
        },
    })

    pendingOrders = orders.length

    let interations = []
    if (profile?.userId) {
        interations = await prisma.orderNotes.findMany({
            where: {
                userId: profile.userId,
                createdAt: {
                    gte: firstDayOfThisMonth,
                    lt: lastDayOfThisMonth
                }
            },
        })
    }

    totalInterations = interations.length

    const data = {
        totalOrders: totalOrders,
        pendingOrders: pendingOrders,
        interations: totalInterations
    }
    return (
        <div>
            <div className='grid grid-cols-3 gap-1'>
                <div className='bg-red-100 p-5 rounded-md'>
                    <div className='text-3xl font-bold text-center'>{data.totalOrders}</div>
                    <div className='text-center'>Total Orders</div>
                </div>
                <div className='bg-yellow-100 p-5 rounded-md'>
                    <div className='text-3xl font-bold text-center'>{data.pendingOrders}</div>
                    <div className='text-center'>Under You</div>
                </div>
                <div className='bg-green-100 p-5 rounded-md'>
                    <div className='text-3xl font-bold text-center'>{data.interations}</div>
                    <div className='text-center'>Your Interactions</div>
                </div>

            </div>
        </div>
    )
}

export default OrderStats
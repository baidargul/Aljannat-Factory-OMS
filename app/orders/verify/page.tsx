
import GenericGrid from '@/components/Grid/GenericGrid'
import currentProfile from '@/lib/current-profile'
import prisma from '@/lib/prisma'
import { redirectToSignIn } from '@clerk/nextjs'
import { Role } from '@prisma/client'
import { redirect } from 'next/navigation'
import React from 'react'

type Props = {}

const OrdersVerifyingPage = async (props: Props) => {
    const orders = await getOrders()
    const profile = await currentProfile()
    if (!profile) {
        redirectToSignIn()
    } else {
        if (profile.role === Role.UNVERIFIED) redirect(`/home/unverified/${profile.userId}`)
    }

    return (
        <div className={`flex flex-col gap-2 justify-center items-center p-4 cursor-default`}>
            <div className="w-full">
                <div>
                    <GenericGrid orders={orders} />
                </div>

            </div>
        </div>
    )
}

export default OrdersVerifyingPage


async function getOrders() {

    const orders = await prisma.orders.findMany({
        include: {
            customers: true,
            profile: true,
            orderNotes: {
                orderBy: {
                    createdAt: "desc",
                }
            },
            ordersRegister: {
                include: {
                    productVariations: {
                        select: {
                            name: true,
                            defaultUnit: true,
                        }
                    },
                    product: {
                        select: {
                            id: true,
                            name: true,
                        }
                    },
                }
            },
        },
        orderBy: {
            dateOfBooking: "desc",
        }
    });
    return orders
}

import GenericGrid from '@/components/Grid/GenericGrid'
import currentProfile from '@/lib/current-profile'
import prisma from '@/lib/prisma'
import { redirectToSignIn } from '@clerk/nextjs'
import { Role, Status, profile } from '@prisma/client'
import { redirect } from 'next/navigation'
import React from 'react'
import { toast } from 'sonner'

type Props = {}

const OrdersVerifyingPage = async (props: Props) => {
    const profile = await currentProfile()
    if (!profile) {
        redirectToSignIn()
    } else {
        if (profile.role === Role.UNVERIFIED) redirect(`/home/unverified/${profile.userId}`)
    }
    let orders: any
    if (profile) {
        orders = await getOrders(profile)
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


async function getOrders(profile: profile) {
    const user = await prisma.profile.findUnique({
        where: {
            userId: String(profile.userId),
        }
    })

    if (!user) {
        toast.error("Invalid Session, User not found!")
        redirect("/")
    }

    const role: Role = user.role;
    let orders: any;
    if (role === Role.ADMIN || role === Role.SUPERADMIN || role === Role.MANAGER) {
        orders = await prisma.orders.findMany({
            include: {
                customers: true,
                profile: true,
                orderNotes: {
                    include: {
                        profile: true,
                    },
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
                dateOfBooking: "asc",
            }
        });
    } else {
        const targetStatus: Status = orderStatusforUser(user);

        orders = await prisma.orders.findMany({
            include: {
                customers: true,
                profile: true,
                orderNotes: {
                    include: {
                        profile: true,
                    },
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
                dateOfBooking: "asc",
            },
            where: {
                status: targetStatus,
            }
        });
    }
    return orders
}

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
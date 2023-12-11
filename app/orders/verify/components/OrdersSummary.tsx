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


    return (
        <div className='w-full'>
            <div className='pr-2'>
                <section className='flex justify-between text-sm font-semibold font-mono text-slate-600'>
                    <div>
                        On hold:
                    </div>
                    <div>
                        {await getOrders()}
                    </div>
                </section>
                <section className='flex justify-between text-sm font-semibold font-mono text-slate-600'>
                    <div>
                        Under me:
                    </div>
                    <div>
                        {await currentUserOrders(String(profile?.userId))}
                    </div>
                </section>
                <section className='flex justify-between text-sm font-semibold font-mono text-slate-600'>
                    <div>
                        Pending orders:
                    </div>
                    <div>
                        {await Pending(profile)}
                    </div>
                </section>
                <section className='flex justify-between text-sm font-semibold font-mono text-slate-600'>
                    <div>
                        Oldest:
                    </div>
                    <div>
                        {await oldestOrderDate()}
                    </div>
                </section>

            </div>
        </div>
    )
}

export default OrdersSummary

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

async function Pending(profile: any) {
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
    return orders.length
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
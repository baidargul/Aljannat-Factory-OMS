import prisma from '@/lib/prisma'
import React from 'react'
import ProductTable from './components/ProductTable'
import { Role, Status } from '@prisma/client'
import OrderDetails from './components/OrderDetails'
import Image from 'next/image'
import HistoryFile from './components/HistoryFile'

type Props = {
    params: {
        id: string
    }
}

const page = async (props: Props) => {
    const { params } = props
    const { id } = params

    if (!id) {

    }

    const order = await prisma.orders.findUnique({
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
        where: {
            id: id
        },
    });


    return (
        order && <div className='min-h-screen flex justify-center items-center w-full p-2 bg-slate-100 select-none'>
            <section className='w-full grid grid-cols-2 gap-2'>
                <div>
                    <div>
                        <OrderDetails order={order} />
                    </div>
                    <div className='my-2'>
                        <ProductTable order={order} />
                    </div>
                </div>
                <div className=''>
                    <HistoryFile order={order} />
                </div>
            </section>
        </div>
    )
}

export default page

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


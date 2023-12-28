import React from 'react'
import prisma from '@/lib/prisma'
import POSHolder from './POSHolder'
type Props = {
    currentUser: any
    orderId: string
}

type Product = {
    id: string;
    productName: string;
    variantName: string;
    weight: number;
    amount: number;
    unit: string;
};

const ProductCollection = async (props: Props) => {

    const products = await prisma.product.findMany({
        include: {
            productVariations: true
        },
        orderBy: {
            name: 'asc'
        }
    })

    let availableCities = await prisma.logisticsCities.findMany({
        orderBy: {
            City: 'asc'
        }
    })

    const moldedCites = availableCities.map((city) => {
        return {
            name: city.City,
            label: city.City,
        }
    })

    const freshOrder = await prisma.orders.findUnique({
        include: {
            customers: {
                include: {
                    logisticsCities: true,
                }
            },
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
            id: props.orderId
        }
    });

    let cartItems: any = []
    freshOrder?.ordersRegister.map((order) => {
        cartItems.push({
            id: order.id,
            productName: order?.product?.name,
            variantName: order?.productVariations?.name,
            weight: order.weight,
            amount: order.amount,
            unit: order?.productVariations?.defaultUnit,
        })
    })

    // if(!order){
    //     return <div className='text-center font-semibold text-white p-1 rounded bg-slate-600'>Order not found</div>
    // }

    const order = {
        id: freshOrder?.id,
        createdAt: freshOrder?.createdAt,
        updatedAt: freshOrder?.updatedAt,
        dateOfBooking: freshOrder?.dateOfBooking,
        dateOfDelivery: freshOrder?.dateOfDelivery,
        status: freshOrder?.status,
        customers: freshOrder?.customers,
        ordersRegister: cartItems,
    }

    return (
        <div className=''>
            <POSHolder products={products} currentUser={props.currentUser} availableCities={moldedCites} order={order} />
        </div>
    )
}

export default ProductCollection
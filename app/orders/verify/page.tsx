
import GenericGrid from '@/components/Grid/GenericGrid'
import currentProfile from '@/lib/current-profile'
import prisma from '@/lib/prisma'
import { redirectToSignIn } from '@clerk/nextjs'
import React from 'react'

type Props = {}

const page = async (props: Props) => {
    const orders = await getOrders()
    const profile = await currentProfile()
    if(!profile)
    {
      redirectToSignIn()
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

export default page


async function getOrders() {

    const orders = await prisma.orders.findMany({
        include: {
            customers: true,
            profile: true,
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
            }
        },
        orderBy: {
            dateOfBooking: "desc"
        }
    });
    return orders
}
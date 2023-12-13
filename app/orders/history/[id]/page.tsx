import prisma from '@/lib/prisma'
import React from 'react'
import ProductTable from './components/ProductTable'

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
        order && <div className='min-h-screen w-full p-2 bg-slate-100 select-none'>
            <section>
                <div>

                </div>
                <div>
                    <ProductTable order={order} />
                </div>
            </section>
        </div>
    )
}

export default page
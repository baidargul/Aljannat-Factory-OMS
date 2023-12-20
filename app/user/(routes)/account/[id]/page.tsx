import currentProfile from '@/lib/current-profile'
import prisma from '@/lib/prisma'
import { redirectToSignIn } from '@clerk/nextjs'
import { Role } from '@prisma/client'
import { Scan } from 'lucide-react'
import Image from 'next/image'
import { redirect } from 'next/navigation'
import React from 'react'
import { v4 } from 'uuid'

type Props = {
    params: {
        id: string
    }
}

const UserAccount = async (props: Props) => {
    const { id } = props.params
    const profile = await currentProfile()
    if (!profile) {
        redirectToSignIn()
    } else {
        if (profile.role === Role.UNVERIFIED) redirect(`/home/unverified/${profile.userId}`)
    }

    const user = await prisma.profile.findUnique({
        where: {
            userId: id
        }
    })

    if (!user) redirect('404')

    return (
        <div className='select-none bg-gradient-to-b from-stone-50 to-slate-100 min-h-min w-full'>
            <div className='p-2'>
                <div className='bg-gradient-to-r from-rose-100 to-orange-200 w-full rounded-md flex flex-col items-center justify-center'>
                    <div className='grid grid-cols-2 p-4 px-6 items-center gap-10'>
                        <section className=''>
                            <div className=''>
                                {
                                    user && (
                                        <Image src={user ? String(user.imageURL) : "/profile/default.jpg"} width={300} height={300} className='rounded-full drop-shadow-md border-8 border-white' alt={user && user.name} />
                                    )
                                }
                            </div>
                        </section>
                        <section>
                            <div className='text-4xl '>
                                {user?.name}
                            </div>
                            <div className='text-sm  bg-gradient-to-r from-rose-100 to-orange-200 w-fit px-2 rounded-md drop-shadow-sm uppercase'>
                                {user && getStage(user?.role)}
                            </div>
                            <div>
                                {user?.email}
                            </div>
                            <div className='text-xs uppercase'>
                                {user?.id}
                            </div>
                        </section>
                    </div>
                    <div className=''>

                    </div>
                </div>
            </div>
            <div className='p-2 h-[400px] w-full'>
                <div className='w-full'>
                    <section className='p-2 bg-white rounded-t-md drop-shadow-sm w-full'>
                        
                    </section>
                    <section>

                    </section>
                </div>
            </div>
        </div>
    )
}

export default UserAccount

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
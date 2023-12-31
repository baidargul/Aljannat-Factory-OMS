import { formalizeText, getCurrentUserCasualStatus } from '@/lib/my'
import { Role } from '@prisma/client'
import Image from 'next/image'
import React from 'react'
import RoleSelector from './RoleSelector'

type Props = {
    user: any
    getUsers: any
    profile: any
    getPendingUsers: any
}

const roleMenu = [
    {
        name: Role.ADMIN,
        label: "Admin"
    },
    {
        name: Role.DISPATCHER,
        label: "Dispatcher"
    },
    {
        name: Role.INVENTORYMANAGER,
        label: "Inventory Manager"
    },
    {
        name: Role.MANAGER,
        label: "Manager"
    },
    {
        name: Role.ORDERBOOKER,
        label: "Order Booker"
    },
    {
        name: Role.ORDERVERIFIER,
        label: "Order Verifier"
    },
    {
        name: Role.PAYMENTVERIFIER,
        label: "Payment Verifier"
    },
    {
        name: Role.SUPERADMIN,
        label: "Super Admin"
    },
    {
        name: Role.UNVERIFIED,
        label: "Unverified"
    }
]


const Row = (props: Props) => {
    const user = props.user
    const profile = props.profile.profile


    return (
        <div className='bg-gradient-to-r from-orange-50 to-orange-50 p-1 border border-slate-100 drop-shadow-sm text-sm'>
            <div className='grid grid-cols-4 items-center'>
                <div className='flex gap-1 items-center'>
                    <Image src={user.imageURL} alt='user image' width={40} height={40} className='rounded-md' />
                    <div className=''>
                        <div className='relative'>
                            <div className='w-32 truncate'>
                                {user.name}
                            </div>

                            {
                                user.userId === profile.userId &&
                                (<div className={`bg-gradient-to-r from-violet-200 to-pink-200 rounded-md w-fit p-1 scale-75 absolute -top-1 right-0`}>You</div>)
                            }
                        </div>
                        <div className='text-xs'>{user.email}</div>
                    </div>
                </div>
                <div>
                    <div>Created on:</div>
                    <div className='text-xs'>
                        {new Date(user.createdAt).toDateString()}
                    </div>
                </div>
                <div className=''>
                    <div>Interactions:</div>
                    <div className='bg-gradient-to-r from-amber-200 to-amber-300 p-1 rounded-md w-fit text-center scale-90 flex gap-1'>on <p className='font-semibold '>{user.orderNotes.length}</p> orders</div>
                </div>
                <div className='flex justify-center items-center'>
                    <RoleSelector user={user} roleMenu={roleMenu} getUsers={props.getUsers} getPendingUsers={props.getPendingUsers} />
                </div>
            </div>
        </div>
    )
}

export default Row
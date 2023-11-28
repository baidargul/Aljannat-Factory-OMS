import React from 'react'
import GridWithFilters from './GridFilters'
import currentProfile from '@/lib/current-profile'
import { redirectToSignIn } from '@clerk/nextjs'
import Image from 'next/image'
import { v4 } from 'uuid'
import LogoutComponent from './GenericRowsHolder/Logout'
import { Role } from '@prisma/client'


type Props = {
    orders: any

}

const GenericRowsHolder = async (props: Props) => {
    const profile = await currentProfile()
    if (!profile) {
        redirectToSignIn()
    }

    type availableCity = {
        name: String
        label: String
    }

    const availableCities: availableCity[] = [];
    props.orders.map((order: any) => {
        let isCityAvailable = false;
        availableCities.map((city: availableCity) => {
            if (String(city.name).toLocaleLowerCase() === String(order.customers.city).toLocaleLowerCase()) {
                isCityAvailable = true;
            }
        });
        if (!isCityAvailable) {
            availableCities.push({ name: order.customers.city, label: order.customers.city });
        }
    });


    return (
        <>
            <div className='w-full'>
                <div>
                    <div className='p-2 border-b-4 border-slate-800 bg-slate-800 text-white'>
                        <div className='p-2 flex justify-between items-center'>
                            <div className='flex flex-col items-center gap-2'>
                                <div className='text-4xl font-semibold text-white'>
                                    Aljannat Sweets
                                </div>
                                <div className='font-normal tracking-widest opacity-50 p-1 border border-dashed border-opacity-50 rounded'>
                                    Order Management Portal
                                </div>
                            </div>
                            <div>
                                <div className='flex gap-2 items-center'>
                                    <div className=''>
                                        {profile && (
                                            <Image className='rounded border-b border-white' src={String(profile.imageURL)} width={50} height={50} alt={profile ? profile.name : v4()} />
                                        )}
                                    </div>
                                    <div>
                                        <div>
                                            <div className='font-semibold tracking-wide'>
                                                {profile?.name}
                                            </div>
                                            <div className='text-xs scale-90 -ml-1 -mt-1 opacity-50'>
                                                {profile && getStage(profile?.role)}
                                            </div>
                                            <div>
                                                <LogoutComponent />
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                <div>

                                </div>
                            </div>
                        </div>
                    </div>
                    <div className='mt-5'>
                        <GridWithFilters orders={props.orders} profile={profile} availableCities={availableCities} />
                    </div>
                </div>
            </div>
        </>
    )
}

export default GenericRowsHolder

function getStage(role: Role) {
    switch (role) {
        case Role.ADMIN:
            break;

        case Role.MANAGER:
            break;

        case Role.ORDERBOOKER:
            return 'Order Booker'
            break;

        case Role.ORDERVERIFIER:
            return 'Order Verifier'

        case Role.PAYMENTVERIFIER:
            return 'Payment Verifier'
        case Role.DISPATCHER:
            return 'Dispatcher'
        case Role.SUPERADMIN:
            break;

        default:
            break;
    }
}
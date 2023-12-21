import React from 'react'
import GridWithFilters from './GridFilters'
import currentProfile from '@/lib/current-profile'
import { redirectToSignIn } from '@clerk/nextjs'
import Image from 'next/image'
import { v4 } from 'uuid'
import LogoutComponent from './GenericRowsHolder/Logout'
import { Role } from '@prisma/client'
import ProfileRedirector from './GenericRowsHolder/ProfileRedirector'


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
    type AvailablePhones = {
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

    const availablePhones: AvailablePhones[] = [];
    props.orders.map((order: any) => {
        let isPhone1Available = false;
        let isPhone2Available = false;
        availablePhones.map((phone: AvailablePhones) => {
            if (String(phone.name).toLocaleLowerCase() === String(order.customers.phone).toLocaleLowerCase()) {
                isPhone1Available = true;
            }
            if (String(phone.name).toLocaleLowerCase() === String(order.customers.phone2).toLocaleLowerCase()) {
                isPhone2Available = true;
            }
        });
        if (!isPhone1Available) {
            if (order.customers.phone) {
                availablePhones.push({ name: order.customers.phone, label: order.customers.phone });
            }
        }
        if (!isPhone2Available) {
            if (order.customers.phone2) {
                availablePhones.push({ name: order.customers.phone2, label: order.customers.phone2 });
            }
        }
    });


    return (
        <>
            <div className='w-full'>
                <div>
                    {/* <div className='p-2 border-b-4 border-slate-800 bg-slate-800 text-white'>
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
                                            <ProfileRedirector>
                                                <Image className='rounded border-b border-white cursor-pointer' src={String(profile.imageURL)} width={50} height={50} alt={profile ? profile.name : v4()} />
                                            </ProfileRedirector>
                                        )}
                                    </div>
                                    <div>
                                        <div>
                                            <ProfileRedirector>
                                                <div className='font-semibold tracking-wide hover:border-b-2 border-slate-400 cursor-pointer hover:border-spacing-1 transition-all hover:mb-2'>
                                                    {profile?.name}
                                                </div>
                                            </ProfileRedirector>
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
                    </div> */}
                    <div className=''>
                        <GridWithFilters orders={props.orders} profile={profile} availableCities={availableCities} availablePhones={availablePhones} />
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
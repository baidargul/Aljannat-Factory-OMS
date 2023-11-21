import React from 'react'
import GridWithFilters from './GridFilters'
import currentProfile from '@/lib/current-profile'
import { redirectToSignIn } from '@clerk/nextjs'

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
                <GridWithFilters orders={props.orders} profile={profile} availableCities={availableCities} />
            </div>
        </>
    )
}

export default GenericRowsHolder
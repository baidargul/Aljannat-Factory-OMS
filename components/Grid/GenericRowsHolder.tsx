import React from 'react'
import GridWithFilters from './GridFilters'
import currentProfile from '@/lib/current-profile'
import { redirectToSignIn } from '@clerk/nextjs'

type Props = {
    orders: any

}

const GenericRowsHolder = async(props: Props) => {
    const profile = await currentProfile()
    if (!profile) {
        redirectToSignIn()
    }


    return (
        <>
            <div className='w-full'>
                <GridWithFilters orders={props.orders} profile={profile}/>
            </div>
        </>
    )
}

export default GenericRowsHolder
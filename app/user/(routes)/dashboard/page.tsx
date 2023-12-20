import React from 'react'
import Menu from './components/Menu'
import currentProfile from '@/lib/current-profile'
import { redirectToSignIn } from '@clerk/nextjs'
import { redirect } from 'next/navigation'

type Props = {}

const page = async (props: Props) => {
    const profile = await currentProfile()
    if (!profile) {
        redirect('/')
    }

    return (
        <div>
            <div className='mt-20'>
                <Menu profile={profile} />
            </div>
        </div>
    )
}

export default page
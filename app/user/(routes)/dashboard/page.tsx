import React from 'react'
import Menu from './components/Menu'
import currentProfile from '@/lib/current-profile'
import { redirectToSignIn } from '@clerk/nextjs'
import { redirect } from 'next/navigation'
import { Role } from '@prisma/client'

type Props = {}

const page = async (props: Props) => {
    const profile = await currentProfile()
    if (!profile) {
        redirect('/')
    }

    if (profile.role === Role.ADMIN || profile.role === Role.SUPERADMIN) {
        return (
            <div>
                <div className='mt-20'>
                    <Menu profile={profile} />
                </div>
            </div>
        )

    } else {

        return(
            <div>
                <div className='flex justify-center items-center min-h-screen w-full select-none '>
                    <h1 className='text-3xl font-bold h-fit bg-slate-100/50 p-1 rounded-md border-b-2 border-slate-100'>Your role is not allowed to view this page</h1>
                </div>
            </div>
        )
    }

}

export default page
import React from 'react'
import ProductCollection from './components/products/ProductCollection'
import currentProfile from '@/lib/current-profile'
import { redirectToSignIn } from '@clerk/nextjs'
import { Role } from '@prisma/client'
import { redirect } from 'next/navigation'
type Props = {}

const page = async (props: Props) => {
    const profile = await currentProfile()
    if (!profile) {
        redirectToSignIn()
    } else {
        if (profile.role === Role.UNVERIFIED) redirect(`/home/unverified/${profile.userId}`)
        if (
            profile.role !== Role.SUPERADMIN &&
            profile.role !== Role.ADMIN &&
            profile.role !== Role.ORDERBOOKER &&
            profile.role !== Role.MANAGER
        ) {
            return (
                <div className='flex justify-center items-center min-h-screen w-full select-none '>
                    <h1 className='text-3xl font-bold h-fit bg-slate-100/50 p-1 rounded-md border-b-2 border-slate-100'>Your role is not allowed to view this page</h1>
                </div>
            )
        }
    }

    return (
        <div className=''>
            <div className='bg-slate-300 border drop-shadow-md p-2 select-none'>
                <div>
                    <section>
                        <ProductCollection currentUser={profile} />
                    </section>
                </div>
            </div>

        </div>
    )
}

export default page
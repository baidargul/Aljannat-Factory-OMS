import React from 'react'
import AvailableProducts from './components/AvailableProducts'
import SelectedProduct from './components/SelectedProduct'
import AvailableVariations from './components/subComponents/AvailableVariations'
import CreateProductForm from './components/CreateProductForm'
import DialogProvider from '@/components/DialogProvider/DialogProvider'
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
            !(
                profile.role === Role.SUPERADMIN ||
                profile.role === Role.ADMIN
            )
        ) {
            return (
                <div className='flex justify-center items-center min-h-screen w-full select-none '>
                    <h1 className='text-3xl font-bold h-fit bg-slate-100/50 p-1 rounded-md border-b-2 border-slate-100'>Your role is not allowed to view this page</h1>
                </div>
            )
        }
    }

    return (
        <div className='w-full grid grid-cols-1 border rounded-md bg-white p-2 min-h-screen drop-shadow-sm'>
            <div className='border border-zinc-800'>
                <div className='flex flex-col items-center '>
                    <div className='font-semibold tracking-wider text-2xl bg-gradient-to-t from-slate-600 to-slate-500 text-white w-full text-center'>
                        Products
                    </div>
                    <div className=' w-full p-2'>
                        <AvailableProducts />
                    </div>
                </div>
                <div className=''>
                    <SelectedProduct />
                </div>
                <div className=''>
                    <AvailableVariations />
                </div>
            </div>
            {/* <div className='border border-zinc-800'>
                <div className='bg-gradient-to-t from-slate-600 to-slate-500 w-full text-2xl font-semibold text-white pl-5'>
                    Editor
                </div>
                <div className='p-4'>
                    <CreateProductForm />
                </div>
            </div> */}
        </div>
    )
}

export default page
import currentProfile from '@/lib/current-profile'
import { redirectToSignIn } from '@clerk/nextjs'
import { Role } from '@prisma/client'
import { Scan } from 'lucide-react'
import Image from 'next/image'
import React from 'react'
import { v4 } from 'uuid'

type Props = {}

const UserAccount = async (props: Props) => {
    const profile = await currentProfile()
    if (!profile) {
        redirectToSignIn()
    }


    const settings = [
        "Profile", "APIs", "Orders", "Activities"
    ]

    return (
        <div className='select-none bg-gradient-to-b from-stone-50 to-slate-100 min-h-min w-full'>
            <div className='p-2'>
                <div className='bg-gradient-to-r from-rose-100 to-orange-200 w-full rounded-md flex flex-col items-center justify-center'>
                    <div className='grid grid-cols-2 p-4 px-6 items-center gap-10'>
                        <section className=''>
                            <div className=''>
                                {
                                    profile && (
                                        <Image src={profile ? String(profile.imageURL) : "/profile/default.jpg"} width={300} height={300} className='rounded-full drop-shadow-md border-8 border-white' alt={profile && profile.name} />
                                    )
                                }
                            </div>
                        </section>
                        <section>
                            <div className='text-4xl '>
                                {profile?.name}
                            </div>
                            <div className='text-sm  bg-gradient-to-r from-rose-100 to-orange-200 w-fit px-2 rounded-md drop-shadow-sm uppercase'>
                                {profile && getStage(profile?.role)}
                            </div>
                            <div>
                                {profile?.email}
                            </div>
                            <div className='text-xs uppercase'>
                                {profile?.id}
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
                        <div className='tracking-wide font-semibold text-lg text-black/70 text-center'>
                            Settings
                        </div>
                        <div className='mt-2 w-full'>
                            <div className='px-10'>
                                <section className='flex gap-1 justify-between items-center'>
                                    {
                                        settings.map((setting: string) => (
                                            <div key={v4()} className='group active:bg-orange-400 active:text-white rounded text-sm flex gap-1 items-center'>
                                                <div className='p-1  group-hover:animate-pulse duration-1000 opacity-0 group-hover:opacity-70 transition-all'>
                                                    <Scan className='w-4 h-4 group-active:text-white group-active:scale-110' />
                                                </div>
                                                <div className='p-1 group-hover:first-letter:text-red-800 group-active:first-letter:text-white group-active:text-white duration-1000 transition-all text-black/70'>
                                                    {setting}
                                                </div>
                                            </div>
                                        ))
                                    }
                                </section>
                                <section>

                                </section>
                            </div>
                        </div>
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
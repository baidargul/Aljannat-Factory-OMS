import { Bell, Menu } from 'lucide-react'
import Link from 'next/link'
import React from 'react'
import ProfileMenu from './components/ProfileMenu'
import prisma from '@/lib/prisma'
import NotificationIcon from './components/sub/NotificationIcon'
import MainMenu from './components/MainMenu'

type Props = {}

const Header = async (props: Props) => {
    const pendingUsers = await prisma.profile.findMany({
        where: {
            role: 'UNVERIFIED'
        }
    })

    return (
        <div className='flex p-4 bg-slate-100 items-center justify-between select-none text-slate-700'>
            <div className='flex gap-2 items-center group'>
                <div>
                    <MainMenu />
                </div>
                <div className='text-2xl font-semibold font-sans group-hover:tracking-wide transition-all duration-500'>
                    <Link href='/'>
                        Aljannat
                    </Link>
                </div>
            </div>
            <div className='flex items-center gap-1'>
                <div>
                    <ProfileMenu />
                </div>
                <div className=''>
                    <NotificationIcon pendingUsers={pendingUsers} />
                </div>
            </div>

        </div>
    )
}

export default Header
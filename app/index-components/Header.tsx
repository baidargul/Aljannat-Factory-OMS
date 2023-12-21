import { Bell, Menu } from 'lucide-react'
import Link from 'next/link'
import React from 'react'
import ProfileMenu from './components/ProfileMenu'
import prisma from '@/lib/prisma'
import NotificationIcon from './components/sub/NotificationIcon'

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
                <div className='cursor-pointer hover:skew-x-12 transition-all duration-500'>
                    <Menu size={24} />
                </div>
                <div className='text-2xl font-semibold font-sans group-hover:tracking-wide transition-all duration-500'>
                    <Link href='/'>
                        Aljannat
                    </Link>
                </div>
            </div>
            <div className='flex gap-1 items-center'>
                <div>
                    <ProfileMenu />
                </div>
                <div>
                    <NotificationIcon pendingUsers={pendingUsers} />
                </div>
            </div>

        </div>
    )
}

export default Header
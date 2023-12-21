import { Bell, Menu } from 'lucide-react'
import Link from 'next/link'
import React from 'react'
import ProfileMenu from './components/ProfileMenu'
import prisma from '@/lib/prisma'

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
                <div className='relative text-slate-700 bg-white p-1 rounded-md'>
                    <p className={`absolute bg-red-500 text-white text-center text-xs rounded-full scale-75 -right-1 -top-2 w-4 h-4 ${pendingUsers.length === 0 ? "hidden": ""}`}>{pendingUsers.length}</p>
                    <Bell size={20} />
                </div>
            </div>

        </div>
    )
}

export default Header
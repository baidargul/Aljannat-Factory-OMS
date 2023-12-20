'use client'
import { useClerk } from '@clerk/nextjs'
import { Barcode, LayoutDashboard, LogOut } from 'lucide-react'
import Link from 'next/link'
import React from 'react'

type Props = {}

const ProfileHoverCard = (props: Props) => {
    const { signOut } = useClerk()


    const menuItems = [
        {
            name: "Dashboard",
            link: "/user/dashboard",
            icon: LayoutDashboard
        },
        {
            name: "Orders",
            link: "/orders/verify",
            icon: Barcode
        }
    ]

    return (
        <div>
            <div className='text-xs underline mb-2 text-slate-400'>
                Navigation
            </div>
            <div className='flex flex-col gap-2'>
                {
                    menuItems.map((menu) => {
                        return (
                            <section key={menu.name} className='hover:bg-slate-100 rounded-md p-1'>
                                <Link href={menu.link}>
                                    <div className='font-semibold gap-4 flex items-center text-zinc-600'>
                                        <menu.icon size={18} />
                                        <div>
                                            {menu.name}
                                        </div>
                                    </div>
                                </Link>
                            </section>
                        )
                    })
                }

            </div>
            <div onClick={() => signOut()} className='cursor-pointer border-t border-slate-200 mt-4 py-1 text-slate-700 flex gap-1 items-center rounded-md hover:px-1 transition-all duration-500 hover:text-red-500 hover:bg-orange-50  hover:border-red-500'>
                <div>
                    <LogOut size={15} />
                </div>
                <div>
                    Logout
                </div>
            </div>
        </div>
    )
}

export default ProfileHoverCard
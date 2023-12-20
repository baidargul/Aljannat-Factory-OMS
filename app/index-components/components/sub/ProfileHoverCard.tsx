'use client'
import { Barcode, LayoutDashboard } from 'lucide-react'
import Link from 'next/link'
import React from 'react'

type Props = {}

const ProfileHoverCard = (props: Props) => {
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
            <div className='text-xs '>
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
        </div>
    )
}

export default ProfileHoverCard
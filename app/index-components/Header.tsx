import { ArrowDown, ChevronDown, Menu } from 'lucide-react'
import Image from 'next/image'
import Link from 'next/link'
import React from 'react'
import ProfileMenu from './components/ProfileMenu'

type Props = {}

const Header = (props: Props) => {
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
            <div>
                <ProfileMenu />
            </div>
        </div>
    )
}

export default Header
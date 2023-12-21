import HoverCardProvider from '@/components/HoverCardProvider/HoverCardProvider'
import { ChevronDown } from 'lucide-react'
import Image from 'next/image'
import React from 'react'
import ProfileHoverCard from './sub/ProfileHoverCard'
import currentProfile from '@/lib/current-profile'
import { profile } from '@prisma/client'
import PopoverProvider from '@/components/Popover/PopoverProvider'

type Props = {}

const ProfileMenu = async (props: Props) => {
    const profile: any = await currentProfile()

    return (
        <PopoverProvider content={<ProfileHoverCard profile={profile} />} >
            <div className='flex items-center gap-2 bg-white p-1 rounded drop-shadow-sm group cursor-pointer'>
                <div>
                    <Image src={profile.imageURL ? profile.imageURL : '/Placeholders/default.png'} width={30} height={30} alt='userProfile' className='rounded-full' />
                </div>
                <div className='flex flex-col'>
                    <div className='font-bold'>
                        {profile.name}
                    </div>
                    <div className='text-sm -mt-1 scale-90 -ml-2'>
                        {profile.email}
                    </div>
                </div>
                <div className='text-slate-500 group-hover:mt-1 transition-all duration-500'>
                    <ChevronDown size={20} />
                </div>
            </div>
        </PopoverProvider>
    )
}

export default ProfileMenu

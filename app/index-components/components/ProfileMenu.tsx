import { ChevronDown } from 'lucide-react'
import Image from 'next/image'
import React from 'react'

type Props = {}

const ProfileMenu = (props: Props) => {
    return (
        <div className='flex items-center gap-2 bg-white p-1 rounded drop-shadow-sm group cursor-pointer'>
            <div>
                <Image src='/Placeholders/default.png' width={30} height={30} alt='userProfile' className='rounded-full' />
            </div>
            <div className='flex flex-col'>
                <div className='font-bold'>
                    Baidar Gul
                </div>
                <div className='text-sm -mt-1 scale-90 -ml-2'>
                    baidargul@outlook.com
                </div>
            </div>
            <div className='text-slate-500 group-hover:mt-1 transition-all duration-500'>
                <ChevronDown size={20} />
            </div>
        </div>
    )
}

export default ProfileMenu
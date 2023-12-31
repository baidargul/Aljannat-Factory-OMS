import Image from 'next/image'
import React from 'react'
import LogoutButton from './LogoutButton'

type Props = {
    profile: any
}

const UserInformation = (props: Props) => {
    const profile = props.profile
    return (
        <div className='flex flex-col gap-1 items-center'>
            <div className=''>
                <Image src={profile ? String(profile?.imageURL) : ""} alt={profile ? profile?.name : "Username"} width={150} height={150} className='rounded-md border-2 border-white drop-shadow-md' />
            </div>
            <div>
                <h1 className='font-semibold tracking-wide'>{profile && profile.name}</h1>
            </div>
            <div>
                <h2 className='tracking-wide text-xs -mt-2 text-slate-500 border-b border-slate-500 '>{profile && profile.role}</h2>
            </div>
            <div>
                <LogoutButton />
            </div>
        </div>
    )
}

export default UserInformation
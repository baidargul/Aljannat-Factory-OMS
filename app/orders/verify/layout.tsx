import currentProfile from '@/lib/current-profile'
import { redirectToSignIn } from '@clerk/nextjs'
import Image from 'next/image'
import React from 'react'

type Props = {
  children: React.ReactNode
}

const OrdersLayout = async (props: Props) => {
  const profile = await currentProfile()
  if (!profile) {
    redirectToSignIn()
  }


  return (
    <div>
      <div className='flex justify-between w-full p-2 min-h-screen select-none'>
        <div className='w-[15%] bg-slate-100 rounded-md p-2'>
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
          </div>
        </div>
        <div className='w-[85%]'>{props.children}</div>
      </div>
    </div>
  )
}

export default OrdersLayout
import prisma from '@/lib/prisma'
import Image from 'next/image'
import { redirect } from 'next/navigation'
import React from 'react'
import Redirector from './components/Redirector'
import LogoutButton from './components/LogoutButton'
import currentProfile from '@/lib/current-profile'


type Params = {
  id: string
}

type Props = {
  params: Params
}

const page = async (props: Props) => {
  const userId = props.params.id
  const profile = await currentProfile()
  if (profile) {
    profile.role !== "UNVERIFIED" && redirect('/')
  }


  const user = await prisma.profile.findUnique({
    where: {
      userId: userId
    }
  })

  if (!user) return redirect('/404')


  return (
    <div className='flex justify-center items-center min-h-screen p-10 select-none'>
      <div className='p-2 bg-slate-50 rounded-md drop-shadow-md border border-slate-300 flex flex-col justify-center items-center'>
        <div className='my-10'>
          <Image className='rounded border border-white drop-shadow-md' src={user.imageURL ? user.imageURL : '/Placeholders/default.png'} width={200} height={200} alt='unverified-user' />
        </div>
        <div className='text-3xl font-bold'>Welcome `{user.name}`</div>
        <div className='text-sm opacity-60'>{user.email}</div>
        <Redirector profile={user} />
        <div className='text-sm font-bold text-slate-700 border-b border-spacing-1 flex'>You are currently <p className='text-red-700 ml-1'>unverified user</p>. Please contact admins.</div>
        <div className='mt-10'>
          <LogoutButton />
        </div>
      </div>
    </div>
  )
}

export default page
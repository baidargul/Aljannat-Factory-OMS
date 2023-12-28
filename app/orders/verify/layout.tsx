import currentProfile from '@/lib/current-profile'
import { redirectToSignIn } from '@clerk/nextjs'
import Image from 'next/image'
import React from 'react'
import LogoutButton from './components/LogoutButton'
import UserInformation from './components/UserInformation'
import { Input } from '@/components/ui/input'
import RefreshRateContainer from './components/RefreshRateContainer'
import OrdersSummary from './components/OrdersSummary'

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
        <div className='w-[15%] bg-slate-100 rounded-md p-2 flex flex-col gap-4'>
          <UserInformation profile={profile} />
          {/* <RefreshRateContainer /> */}
          <OrdersSummary />
        </div>
        <div className='w-[85%]'>{props.children}</div>
      </div>
    </div>
  )
}

export default OrdersLayout
import React from 'react'
import OrderStats from './sub/OrderStats'
import OrderNotes from '@/app/user/(routes)/dashboard/components/sub/OrderNotes'
import currentProfile from '@/lib/current-profile'

type Props = {}

const Stats = async(props: Props) => {
  const profile = await currentProfile()
  console.log(profile)
  if (!profile) return (noProfile())

  return (
    <div>
      <div>
        <OrderStats />
      </div>
      <div className='mt-5'>
        <div className='text-slate-500 my-1'>Happening right now:</div>
        <OrderNotes profile={profile} />
      </div>
    </div>
  )
}

export default Stats

function noProfile() {
  <div>
    <h1>You must be a registered user to see this page.</h1>
  </div>
}
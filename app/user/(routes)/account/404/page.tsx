import React from 'react'

type Props = {}

const page = (props: Props) => {
  return (
    <div className='bg-slate-100 p-10 border-slate-200 border'>
      <div className='bg-white border border-slate-200 drop-shadow-sm rounded-md p-2'>
        404 - User Not Found
      </div>
    </div>
  )
}

export default page
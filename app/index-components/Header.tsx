import { Brackets, Menu } from 'lucide-react'
import React from 'react'

type Props = {}

const Header = (props: Props) => {
  return (
    <div className='flex p-4 bg-slate-100 items-center gap-2 select-none text-slate-700'>
        <div className='cursor-pointer hover:skew-x-12 transition-all duration-500'>
            <Menu size={24} />
        </div>
        <div className='text-2xl font-semibold font-sans'>
            Aljannat
        </div>
        <div>

        </div>
    </div>
  )
}

export default Header
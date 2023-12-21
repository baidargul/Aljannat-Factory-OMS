import SheetProvider from '@/components/SheetProvider/SheetProvider'
import { Menu } from 'lucide-react'
import React from 'react'

type Props = {}

const MainMenu = (props: Props) => {
  return (
    <SheetProvider side='left' trigger={<Menu size={24} className='cursor-pointer hover:skew-x-12 transition-all duration-500 mt-2'/>}>
      <div className=''>
        <div>
          This
        </div>
      </div>
    </SheetProvider>
  )
}

export default MainMenu
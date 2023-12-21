import SheetProvider from '@/components/SheetProvider/SheetProvider'
import { Barcode, Calculator, Home, LayoutDashboard, Menu, PackageSearch } from 'lucide-react'
import React from 'react'

type Props = {}

const MainMenu = (props: Props) => {
  return (
    <SheetProvider side='left' trigger={<Menu size={24} className='cursor-pointer hover:skew-x-12 transition-all duration-500 mt-2 group-hover:bg-white group-hover:rounded-md group-hover:drop-shadow-sm' />}>
      <div className=''>
        <div className=' text-2xl text-center font-semibold border-b-2 pb-2'>
          Aljannat
        </div>
        <div className='mt-5'>
          <div className='w-full'>
            <div className='text-xl font-semibold hover:bg-slate-50 rounded-md w-full cursor-pointer flex gap-1 items-center'>
              <div>
                <Home size={16} />
              </div>
              <a href='/'>Home</a>
            </div>
            <div className='text-xl font-semibold hover:bg-slate-50 rounded-md w-full cursor-pointer flex gap-1 items-center'>
              <div>
                <Calculator size={16} />
              </div>
              <a href='/create/order/'>POS</a>
            </div>
            <div className='text-xl font-semibold hover:bg-slate-50 rounded-md w-full cursor-pointer flex gap-1 items-center'>
              <div>
                <LayoutDashboard size={16} />
              </div>
              <a href='/user/dashboard'>Dashboard</a>
            </div>
            <div className='text-xl font-semibold hover:bg-slate-50 rounded-md w-full cursor-pointer flex gap-1 items-center'>
              <div>
                <Barcode size={16} />
              </div>
              <a href='/orders/verify'>Orders</a>
            </div>
            <div className='text-xl font-semibold hover:bg-slate-50 rounded-md w-full cursor-pointer flex gap-1 items-center'>
              <div>
                <PackageSearch size={16} />
              </div>
              <a href='/create/products'>Products</a>
            </div>
          </div>
        </div>
      </div>
    </SheetProvider>
  )
}

export default MainMenu
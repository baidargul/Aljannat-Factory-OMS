import React from 'react'
import AvailableProducts from './components/AvailableProducts'
import SelectedProduct from './components/SelectedProduct'
import AvailableVariations from './components/subComponents/AvailableVariations'
import CreateProductForm from './components/CreateProductForm'
import DialogProvider from '@/components/DialogProvider/DialogProvider'

type Props = {}

const page = (props: Props) => {
    return (
        <div className='w-full grid grid-cols-1 border rounded-md bg-white p-2 min-h-screen drop-shadow-sm'>
            <div className='border border-zinc-800'>
                <div className='flex flex-col items-center '>
                    <div className='font-semibold tracking-wider text-2xl bg-gradient-to-t from-slate-600 to-slate-500 text-white w-full text-center'>
                        Products
                    </div>
                    <div className=' w-full p-2'>
                        <AvailableProducts />
                    </div>
                </div>
                <div className=''>
                    <SelectedProduct />
                </div>
                <div className=''>
                    <AvailableVariations />
                </div>
            </div>
            {/* <div className='border border-zinc-800'>
                <div className='bg-gradient-to-t from-slate-600 to-slate-500 w-full text-2xl font-semibold text-white pl-5'>
                    Editor
                </div>
                <div className='p-4'>
                    <CreateProductForm />
                </div>
            </div> */}
        </div>
    )
}

export default page
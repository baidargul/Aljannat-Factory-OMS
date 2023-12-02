import React from 'react'
import AvailableProducts from './components/AvailableProducts'
import SelectedProduct from './components/SelectedProduct'
import AvailableVariations from './components/subComponents/AvailableVariations'
import { Input } from '@/components/ui/input'
import CreateProductForm from './components/CreateProductForm'

type Props = {}

const page = (props: Props) => {
    return (
        <div className='w-full grid grid-cols-2 border rounded-md bg-white p-2 min-h-screen drop-shadow-sm'>
            <div className=''>
                <div className='flex flex-col items-center'>
                    <div className='font-semibold tracking-wider text-2xl bg-red-800 text-white w-full text-center'>
                        Products
                    </div>
                    <div className='border border-red-800 w-full p-2'>
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
            <div>
                <div className='bg-red-800 border border-red-800 w-full text-2xl font-semibold text-white pl-5'>
                    Editor
                </div>
                <div className='p-4'>
                    <CreateProductForm />

                </div>
            </div>
        </div>
    )
}

export default page
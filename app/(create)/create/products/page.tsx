import React from 'react'
import AvailableProducts from './components/AvailableProducts'
import SelectedProduct from './components/SelectedProduct'
import AvailableVariations from './components/subComponents/AvailableVariations'

type Props = {}

const page = (props: Props) => {
    return (
        <div className=''>
            <div className='grid grid-cols-3 w-full border rounded-md bg-white p-2 min-h-screen drop-shadow-sm'>
                <div className='border'>
                    <div>
                        <div className='text-2xl font-bold'>
                            Products
                        </div>
                        <div className='text-sm'>
                            <AvailableProducts />
                        </div>
                    </div>
                </div>
                <div className='border flex flex-col items-center'>
                    <div className='text-2xl font-bold'>
                        <SelectedProduct />
                    </div>
                    <div className=''>
                        <div>
                            <AvailableVariations/>
                        </div>
                    </div>
                </div>
                <div className='border'></div>
            </div>
        </div>
    )
}

export default page
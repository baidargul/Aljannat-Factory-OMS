'use client'
import React, { useEffect, useState } from 'react'
import { usePOS } from '@/hooks/usePOS'
import POSItemsHolder from './POSHolder/POSItemsHolder'
import POSOrderRowHolder from './POSHolder/POSOrderRowHolder'
import HoverCardProvider from '@/components/HoverCardProvider/HoverCardProvider'
import CustomerInput from './POSHolder/CustomerInput/CustomerInput'
import { Input } from '@/components/ui/input'

type Props = {
    products: any
}

type productSpecifications = {
    id: string,
    weight: number,
    amount: number
}

const POSHolder = (props: Props) => {
    const [selectedProduct, setSelectedProduct] = useState<any>(null)
    const [totalAmount, setTotalAmount] = useState<number>(0)
    const [customer, setCustomer] = useState<any>(null)
    const POS: any = usePOS()

    // useEffect(() => {
    //     console.log(`POS Products: `, POS.products)
    // }, [POS.products])

    useEffect(() => {
        console.log(customer)
    }, [customer])

    return (
        <>
            <div className='flex gap-2 p-4 bg-red-800 text-white'>
                <HoverCardProvider content={<CustomerInput setCustomer={setCustomer} />}>
                    <div className='flex flex-col'>
                        <p className='font-semibold text-sm tracking-wider'>Name:</p>
                        <Input name='name' placeholder='Customer' className='text-black' value={customer?.name} onChange={(e: any) => {
                            setCustomer({ ...customer, name: e.target.value })
                        }} />
                    </div>
                </HoverCardProvider>
                <div className='flex gap-2'>
                    <div className='flex flex-col'>
                        <p className='font-semibold text-sm tracking-wider'>Phone 01:</p>
                        <Input name='phone01' placeholder='Phone01' className='text-black' value={customer?.phone} onChange={(e: any) => { setCustomer({ ...customer, phone: e.target.value }) }} />
                    </div>
                    <div className='flex flex-col'>
                        <p className='font-semibold text-sm tracking-wider'>Phone 02:</p>
                        <Input name='phone02' placeholder='Phone02' className='text-black' value={customer?.phone2} onChange={(e: any) => { setCustomer({ ...customer, phone2: e.target.value }) }}/>
                    </div>
                    <div className='flex flex-col'>
                        <p className='font-semibold text-sm tracking-wider'>City:</p>
                        <Input name='city' placeholder='City' className='text-black' value={customer?.city} onChange={(e: any) => { setCustomer({ ...customer, city: e.target.value }) }}/>
                    </div>
                    <div className='flex flex-col'>
                        <p className='font-semibold text-sm tracking-wider'>Address:</p>
                        <Input name='address' placeholder='Address' className='text-black' value={customer?.address} onChange={(e: any) => { setCustomer({ ...customer, address: e.target.value }) }}/>
                    </div>
                </div>
            </div>
            <div className="flex gap-2 min-h-screen">
                <div className='w-[40%] text-ellipsis overflow-hidden whitespace-nowrap p-2 bg-slate-200'>
                    <POSItemsHolder products={props.products} selectedProduct={selectedProduct} setSelectedProduct={setSelectedProduct} />
                </div>
                <div className='w-[60%] text-ellipsis overflow-hidden whitespace-nowrap px-2 bg-slate-200'>
                    <POSOrderRowHolder />
                </div>
            </div>
        </>
    )
}

export default POSHolder
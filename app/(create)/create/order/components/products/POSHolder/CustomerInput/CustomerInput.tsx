'use client'
import { Input } from '@/components/ui/input'
import axios from 'axios'
import React from 'react'

type Props = {
    setCustomer: React.Dispatch<React.SetStateAction<any>>
}

const CustomerInput = (props: Props) => {
    const [phone, setPhone] = React.useState<string>('')
    const [customer, setCustomer] = React.useState<any>(null)

    async function handleSearch() {
        if(phone==="00000000001")
        {
            return
        }
        const res = await axios.get("../api/customer/find/phone/" + phone).then((res: any) => {
            if(res.status==200)
            {
                setCustomer(res.data)
                props.setCustomer(res?.data?.data)
            } else{
                setCustomer(null)
                props.setCustomer(null)
            }
        }).catch((err: any) => {
            console.log(`Customer: `, err)
        })
    }

    return (
        <div className='p-4 bg-yellow-100 rounded'>
            <h1 className='font-semibold mb-2'>
                Customer
            </h1>
            <section className='border p-2 flex flex-col gap-2'>
                <div className='text-sm flex flex-col gap-2'>
                    <p className='font-semibold'>Phone:</p>
                    <div className='flex gap-2'>
                        <Input placeholder='0300123456789' className='text-xs' value={phone} onChange={(e: any) => setPhone(e.target.value
                        )} />
                        <button onClick={() => handleSearch()} className='bg-red-800 text-white px-1 text-xs rounded'>Search</button>
                    </div>
                </div>
            </section>
        </div>
    )
}

export default CustomerInput
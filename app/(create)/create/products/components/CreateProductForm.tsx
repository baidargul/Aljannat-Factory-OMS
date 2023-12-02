'use client'
import { Input } from '@/components/ui/input'
import axios from 'axios'
import { useRouter } from 'next/navigation'
import React, { useState } from 'react'
import { toast } from 'sonner'

type Props = {}

const CreateProductForm = (props: Props) => {
    const [productName, setProductName] = useState('')
    const [imageUrl, setImageUrl] = useState('')
    const [isDoing, setIsDoing] = useState(false)
    const router = useRouter()

    async function createProduct() {
        setIsDoing(true)
        try {
            if (!productName) {
                toast.error('Please enter a product name', { duration: 3000 })
            }

            const data = {
                name: productName
            }
            await axios.post(`/api/product/create/`, data).then(async (res) => {
                const data = res.data
                if (data.status === 200) {
                    toast.success(data.message)
                    setProductName('')
                    router.refresh()
                } else {
                    toast.error(data.message)
                }
            }).catch((err) => {
                console.log(err)
            }).then(() => {
                setIsDoing(false)
            })


        } catch (error: any) {
            toast.error(error.message)
        }
        setIsDoing(false)
    }

    return (
        <section className='w-full'>
            <div className='font-semibold'>
                Enter product name:
            </div>
            <div className='flex gap-2 items-center'>
                <div>
                    <Input placeholder='New Product Name' className='h-10' value={productName} onChange={(e: any) => { setProductName(e.target.value) }} />
                </div>
                <div>
                    <Input readOnly className='h-10 cursor-pointer' value={imageUrl? imageUrl : "Select Image"} />
                </div>
                <div>
                    <button onClick={() => createProduct()} className='text-sm bg-slate-100 active:bg-green-50 hover:bg-slate-100/30 p-2 rounded drop-shadow-sm border'>{isDoing ? "Please wait..." : "Add Product"}</button>
                </div>
            </div>
        </section>
    )
}

export default CreateProductForm
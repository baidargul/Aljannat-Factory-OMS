'use client'
import { useCreateProduct } from '@/hooks/useCreateProduct'
import { product, productVariations } from '@prisma/client'
import axios from 'axios'
import { useRouter } from 'next/navigation'
import React from 'react'
import { toast } from 'sonner'

type Props = {
    children: React.ReactNode,
    product: product
}

const AvailableProductSelector = (props: Props) => {
    const router = useRouter()
    const productObj = useCreateProduct()

    async function onClickFunction() {

        const temp: any = await fetchVariations(props.product)
        if (!temp) {
            productObj.selectedProduct = null
            return
        }
        const newRAW = {
            product: { ...props.product },
            productVariations: temp.data
        }
        productObj.selectedProduct = newRAW
        router.refresh()
    }

    function onClearClick() {

    }

    return (
        <div className='flex gap-1 items-center'>
            <div>
                {/* <div onClick={() => onClearClick()} className='bg-red-500 text-xs w-4 h-4 hover:scale-105 hover:drop-shadow-md transition-all cursor-pointer text-center rounded-full flex justify-center items-center text-white'>
                    -
                </div> */}
            </div>
            <button onClick={() => onClickFunction()}>
                {props.children}
            </button>
        </div>
    )
}

export default AvailableProductSelector

async function fetchVariations(product: product) {
    let final = null;
    const data = {
        productId: product.id
    }
    toast.message('Fetching variations...', {
        duration: 1000
    })
    await axios.get(`/api/product/variations/${product.id}/`).then(async (res) => {
        final = await res.data
        toast.success('Variations fetched', {
            duration: 1000
        })
    }).catch((err) => {
        console.log(err)
        toast.error('Error fetching variations', {
            duration: 1000
        })
    })

    return final
}
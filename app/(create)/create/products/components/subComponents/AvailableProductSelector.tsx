'use client'
import { useCreateProduct } from '@/hooks/useCreateProduct'
import { product, productVariations } from '@prisma/client'
import axios from 'axios'
import { useRouter } from 'next/navigation'
import React, { useState } from 'react'
import { toast } from 'sonner'

type Props = {
    children: React.ReactNode,
    product: product
}

const AvailableProductSelector = (props: Props) => {
    const [isHovered, setIsHovered] = useState<boolean>(false)
    const [isDoing, setIsDoing] = useState<boolean>(false)
    const router = useRouter()
    const productObj = useCreateProduct()

    const onClickFunction = async () => {

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

    async function onClear() {
        const selectedProduct = props.product
        if (!selectedProduct) return

        const data = {
            name: selectedProduct.name
        }

        setIsDoing(true)
        await axios.delete("/api/product/remove", { data }).then(async (res) => {
            const result = await res.data
            if (result.status === 200) {
                toast.success('Product Successfully Deleted', { duration: 3000 })
                const newData = await result.data
                props.product = newData
                router.refresh()
            } else {
                toast.error(result.message, { duration: 3000 })
            }
        }).catch((error) => {
            toast.error(`${error.message}, ${error}`, { duration: 3000 })
        }).finally(() => {
            setIsDoing(false)
        })
    }

    return (
        <button onMouseMove={() => setIsHovered(false)} onMouseLeave={() => setIsHovered(false)} className={`relative group items-center hover:drop-shadow-lg bg-gradient-to-r from-slate-50 to-slate-200 transition-all duration-1000 group ${isHovered && "bg-gradient-to-br from-amber-50/30 to-orange-200/30"} ${isDoing && "cursor-not-allowed"}`}>
            <div onClick={() => onClear()} className='absolute text-xs top-1 right-1 w-4 h-4 bg-gradient-to-t from-red-700 to-red-500 text-center text-white  group-hover:flex hidden justify-center items-center rounded-full hover:scale-105 hover:drop-shadow-md transition-all cursor-pointer z-10'>
                -
            </div>
            <div onClick={onClickFunction}>
                {props.children}
            </div>
        </button>
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
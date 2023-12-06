'use client'
import { product, productVariations } from '@prisma/client'
import axios from 'axios'
import { useRouter } from 'next/navigation'
import React, { useEffect, useState } from 'react'
import { toast } from 'sonner'

type Props = {
    selectedProduct: productWithVariations | null
    variant: productVariations
    setSelectedProduct: any
    children: React.ReactNode
}

type productWithVariations = {
    product: product;
    productVariations: productVariations[]
}

const VariationSelector = (props: Props) => {
    const [isHovered, setIsHovered] = useState<boolean>(false)
    const [isDoing, setIsDoing] = useState<boolean>(false)
    const router = useRouter()


    function onClick() {

    }

    async function onClear() {
        const selectedProduct = props.selectedProduct
        if (!selectedProduct) return

        const variant = props.variant
        if (!variant) return

        const data = {
            productId: selectedProduct.product.id,
            name: variant.name
        }

        setIsDoing(true)
        await axios.delete("/api/product/variations/remove", { data }).then(async (res) => {
            const result = await res.data
            if (result.status === 200) {
                toast.success('Successfully deleted', { duration: 3000 })
                const newData = await result.data.data
                props.setSelectedProduct(newData)
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
        <button onMouseMove={() => setIsHovered(false)} onMouseLeave={() => setIsHovered(false)} onClick={onClick} className={`relative group hover:drop-shadow-lg bg-gradient-to-r from-slate-50 to-slate-200 transition-all duration-1000 group ${isHovered && "bg-gradient-to-br from-amber-50/30 to-orange-200/30"} ${isDoing && "cursor-not-allowed"}`}>
            <div className=''>
                <div onClick={() => onClear()} className='absolute top-1 right-1 group-hover:flex hidden bg-gradient-to-t from-red-700 to-red-500 text-xs w-4 h-4 hover:scale-105 hover:drop-shadow-md transition-all cursor-pointer text-center rounded-full justify-center items-center text-white'>
                    -
                </div>
                <div>
                    {props.children}
                </div>
            </div>
        </button>
    )
}

export default VariationSelector
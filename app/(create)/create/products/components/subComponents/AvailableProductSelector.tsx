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
        <button onMouseOver={() => setIsHovered(true)} onMouseOut={() => setIsHovered(false)} className={`flex gap-1 items-center ${isHovered && "bg-gradient-to-br from-amber-50/30 to-orange-200/30"}`} onClick={() => onClickFunction()}>
            {props.children}
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
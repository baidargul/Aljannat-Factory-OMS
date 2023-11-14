import React from 'react'
import prisma from '@/lib/prisma'
import { formalizeText } from '@/lib/my'
import POSItem from './POSItem'
import POSHolder from './POSHolder'
type Props = {}

const ProductCollection = async (props: Props) => {

    const products = await prisma.product.findMany({
        include: {
            productVariations: true
        },
        orderBy: {
            name: 'asc'
        }
    })

    return (
        <div className=''>
            <POSHolder products={products} />
        </div>
    )
}

export default ProductCollection
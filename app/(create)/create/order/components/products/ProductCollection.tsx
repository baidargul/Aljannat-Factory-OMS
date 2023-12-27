import React from 'react'
import prisma from '@/lib/prisma'
import POSHolder from './POSHolder'
type Props = {
    currentUser: any
}

const ProductCollection = async (props: Props) => {

    const products = await prisma.product.findMany({
        include: {
            productVariations: true
        },
        orderBy: {
            name: 'asc'
        }
    })

    let availableCities = await prisma.logisticsCities.findMany({
        orderBy: {
            City: 'asc'
        }
    })

    const moldedCites = availableCities.map((city) => {
        return {
            name: city.City,
            label: city.City,
        }
    })

    return (
        <div className=''>
            <POSHolder products={products} currentUser={props.currentUser} availableCities={moldedCites} />
        </div>
    )
}

export default ProductCollection
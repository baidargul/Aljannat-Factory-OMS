import React from 'react'
import prisma from '@/lib/prisma'
import { product } from '@prisma/client'
import AvailableProductSelector from './subComponents/AvailableProductSelector'
import Image from 'next/image'
type Props = {}

const AvailableProducts = async (props: Props) => {

    const availableProducts = await prisma.product.findMany({
        orderBy: {
            name: 'asc'
        }
    })

    if (!availableProducts) return (<div>No products available</div>)

    return (
        <div>
            <div className='grid grid-cols-3 gap-2'>
                {
                    availableProducts.map((product: product) => {
                        return (
                            <div key={product.id}>
                                <AvailableProductSelector product={product}>
                                    <div className='flex gap-1 items-center'>
                                        <div>
                                            <Image src={`https://getpcsofts.info/wp-content/uploads/2023/09/JetBrains-DataGrip-Crack-300x202.png`} className='w-16 h-16' width={32} height={32} alt='image' />
                                        </div>
                                        <div>
                                            {product.name}
                                        </div>
                                    </div>
                                </AvailableProductSelector>
                            </div>
                        )
                    })
                }
            </div>
        </div>
    )
}

export default AvailableProducts
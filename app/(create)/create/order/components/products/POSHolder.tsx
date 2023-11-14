'use client'
import React, { useEffect, useState } from 'react'
import POSItem from './POSItem'
import POSVariation from './POSVariation'
import { usePOS } from '@/hooks/usePOS'
import { v4 } from 'uuid'
import { formalizeText } from '@/lib/my'
import { Input } from '@/components/ui/input'
import { ScrollArea } from '@/components/ui/scroll-area'

type Props = {
    products: any
}

const POSHolder = (props: Props) => {
    const [selectedProduct, setSelectedProduct] = useState<any>(null)
    const [products, setProducts] = useState<any>([])
    const POS: any = usePOS()

    useEffect(() => {
        setProducts(POS.products)
        console.log(`first render`)
    }, [POS.products])

    const handleBackButton = () => {
        setSelectedProduct(null)
    }

    return (
        <div className="flex gap-2 min-h-screen">
            <div className='w-[40%] text-ellipsis overflow-hidden whitespace-nowrap p-2'>
                <div className='bg-red-800 text-white p-2'>Products</div>
                <div className={`grid grid-cols-2 ${selectedProduct && "hidden"}`}>
                    {
                        props.products.map((product: any) => {
                            return (
                                <div key={product.name}>
                                    <POSItem
                                        key={product.id}
                                        product={product}
                                        setSelectedProduct={setSelectedProduct}
                                        selectedProduct={selectedProduct}
                                    />
                                </div>
                            )
                        })
                    }
                </div>
                <div>
                    {
                        selectedProduct && (
                            <div className='flex flex-col gap-2 text-ellipsis overflow-hidden whitespace-nowrap '>
                                <button onClick={handleBackButton} className='p-2 w-16 px-2 rounded-md mt-2 bg-red-800 text-white'>Return</button>
                                <div className='grid grid-cols-2'>
                                    {
                                        selectedProduct.productVariations.map((variation: any) => {
                                            return (
                                                <div key={variation.id}>
                                                    <POSVariation selectedProduct={selectedProduct} variation={variation} setSelectedProduct={setSelectedProduct} />
                                                </div>
                                            )
                                        })
                                    }
                                </div>
                            </div>
                        )
                    }
                </div>
            </div>
            <div className='w-[60%]'>
                {
                    products && (
                        <div className=' bg-slate-200 p-2 min-h-screen flex flex-col'>
                            <div className='grid grid-cols-4 items-center gap-2 bg-red-800 text-white p-2'>
                                <p>Product</p>
                                <p>Variation</p>
                                <p>Weight (KG)</p>
                                <p>Amount</p>
                            </div>
                            <div className='border border-red-800/40'>
                                <ScrollArea className='h-[500px]'>
                                    {
                                        products.map((item: any) => {
                                            return (
                                                <div key={v4()}>
                                                    <div className='p-2 bg-slate-50 border-b hover:bg-yellow-100'>
                                                        <div className='grid grid-cols-4 items-center gap-2'>
                                                            <div>
                                                                {formalizeText(item.productName)}
                                                            </div>
                                                            <div>
                                                                {formalizeText(item.variantName)}
                                                            </div>
                                                            <div>
                                                                <Input className='text-sm' type='number' placeholder='0.5' />
                                                            </div>
                                                            <div>
                                                                <Input className='text-sm' type='number' placeholder='Rs ' />
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>
                                            )
                                        })
                                    }
                                </ScrollArea>
                            </div>
                            <div className='flex justify-end'>
                                Totals
                            </div>
                        </div>
                    )
                }
            </div>
        </div>
    )
}

export default POSHolder
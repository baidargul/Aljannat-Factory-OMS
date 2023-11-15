'use client'
import React, { useEffect, useState } from 'react'
import POSItem from './POSItem'
import POSVariation from './POSVariation'
import { usePOS } from '@/hooks/usePOS'
import { v4 } from 'uuid'
import { ScrollArea } from '@/components/ui/scroll-area'
import POSOrderRow from './POSOrderRow'

type Props = {
    products: any
}

type productSpecifications = {
    id:string,
    weight:number,
    amount:number
}

const POSHolder = (props: Props) => {
    const [selectedProduct, setSelectedProduct] = useState<any>(null)
    const [products, setProducts] = useState<any>([])
    const [totalAmount, setTotalAmount] = useState<number>(0)
    const POS: any = usePOS()

    useEffect(() => {
        setProducts(POS.products)
        console.log(`POS Products: `,POS.products)
    }, [POS.products])

    useEffect(() => {
        let total = 0
        products.forEach((item: any) => {
            total += Number(item.amount)
        })
        setTotalAmount(total)
        console.log(`Products:`, products)
    }, [products])

    const handleBackButton = () => {
        setSelectedProduct(null)
    }

    return (
        <div className="flex gap-2 min-h-screen">
            <div className='w-[40%] text-ellipsis overflow-hidden whitespace-nowrap p-2 bg-slate-200'>
                <div className='bg-red-800 text-white p-2'>Products</div>
                <div className={`grid grid-cols-2 ${selectedProduct && "hidden"}`}>
                    {
                        props.products.map((product: any) => {
                            return (
                                <div key={product.name} className=''>
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
                                                    <POSVariation  selectedProduct={selectedProduct} variation={variation} setSelectedProduct={setSelectedProduct} />
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
                            <div className='grid grid-cols-5 items-center gap-2 bg-red-800 text-white p-2 font-semibold'>
                                <p>#</p>
                                <p>Product</p>
                                <p>Variation</p>
                                <p>Weight (KG)</p>
                                <p>Amount</p>
                            </div>
                            <div className='border border-red-800/40'>
                                <ScrollArea className='h-[500px]'>
                                    {
                                        products.map((item: any,index:number) => {
                                            return (
                                                <div key={v4()}>
                                                    <POSOrderRow products={products} setProducts={setProducts} index={index} item={item}/>
                                                </div>
                                            )
                                        })
                                    }
                                </ScrollArea>
                            </div>
                            <div className='flex justify-end'>
                                Balance: Rs {totalAmount}
                            </div>
                        </div>
                    )
                }
            </div>
        </div>
    )
}

export default POSHolder
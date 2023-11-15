'use client'
import React from 'react'
import POSItem from '../POSItem'
import POSVariation from '../POSVariation'

type Props = {
    products: any
    selectedProduct: any
    setSelectedProduct: any
}

const POSItemsHolder = (props: Props) => {
    const handleBackButton = () => {
        props.setSelectedProduct(null)
    }

  return (
    <>
    <div className='bg-red-800 text-white p-2'>Products</div>
                <div className={`grid grid-cols-2 ${props.selectedProduct && "hidden"}`}>
                    {
                        props.products.map((product: any) => {
                            return (
                                <div key={product.name} className=''>
                                    <POSItem
                                        key={product.id}
                                        product={product}
                                        setSelectedProduct={props.setSelectedProduct}
                                        selectedProduct={props.selectedProduct}
                                    />
                                </div>
                            )
                        })
                    }
                </div>
                <div>
                    {
                        props.selectedProduct && (
                            <div className='flex flex-col gap-2 text-ellipsis overflow-hidden whitespace-nowrap '>
                                <button onClick={handleBackButton} className='p-2 w-16 px-2 rounded-md mt-2 bg-red-800 text-white'>Return</button>
                                <div className='grid grid-cols-2'>
                                    {
                                        props.selectedProduct.productVariations.map((variation: any) => {
                                            return (
                                                <div key={variation.id}>
                                                    <POSVariation selectedProduct={props.selectedProduct} variation={variation} setSelectedProduct={props.setSelectedProduct} />
                                                </div>
                                            )
                                        })
                                    }
                                </div>
                            </div>
                        )
                    }
                </div>
    </>
  )
}

export default POSItemsHolder
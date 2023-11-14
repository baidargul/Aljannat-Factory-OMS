import { Input } from '@/components/ui/input'
import React from 'react'
import ProductCollection from './components/products/ProductCollection'

type Props = {}

const page = (props: Props) => {
    return (
        <div className=''>
            <div className='bg-slate-300 rounded-md border drop-shadow-md p-2 select-none'>
                <div>
                    <section>
                        <ProductCollection/>
                    </section>
                </div>
            </div>

        </div>
    )
}

export default page
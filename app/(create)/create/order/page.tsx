import React from 'react'
import ProductCollection from './components/products/ProductCollection'
import currentProfile from '@/lib/current-profile'
import { redirectToSignIn } from '@clerk/nextjs'
type Props = {}

const page = async(props: Props) => {
    const profile = await currentProfile()
    if(!profile)
    {
      redirectToSignIn()
    }

    return (
        <div className=''>
            <div className='bg-slate-300 border drop-shadow-md p-2 select-none'>
                <div>
                    <section>
                        <ProductCollection currentUser={profile}/>
                    </section>
                </div>
            </div>

        </div>
    )
}

export default page
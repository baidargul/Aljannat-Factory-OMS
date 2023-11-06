'use client'
import { Star } from 'lucide-react'
import React, { useEffect } from 'react'
import { useRouter } from 'next/navigation'
type Props = {}

const ProcessComplete = (props: Props) => {
    const router = useRouter()


    function handleRedirect() {
        setTimeout(() => {
            router.push('/')
        }, 2000)
    }

    handleRedirect()

    return (
        <div className='w-full min-h-screen bg-slate-300 flex justify-center items-center select-none '>

            <div className='rounded-md p-4 bg-slate-800 text-white'>
                <div className='flex flex-col gap-2 items-center '>
                    <p className='text-yellow-300'>
                        <Star size={22} />
                    </p>
                    <p className='font-semibold'>
                        Process Completed
                    </p>
                </div>
                <p className='text-center text-xs'>
                    Redirecting to Homepage...
                </p>
            </div>

        </div>
    )
}

export default ProcessComplete
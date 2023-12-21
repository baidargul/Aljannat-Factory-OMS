'use client'
import { useClerk } from '@clerk/nextjs'
import React from 'react'

type Props = {}

const LogoutButton = (props: Props) => {
    const { signOut } = useClerk()
    return (
        <div>
            <button onClick={() => signOut()} className='bg-orange-500 hover:bg-orange-500/90 text-white font-bold py-1 px-4 rounded-md'>Logout</button>
        </div>
    )
}

export default LogoutButton
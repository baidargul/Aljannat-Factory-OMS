'use client'
import { useClerk } from '@clerk/nextjs';
import React from 'react'

type Props = {}

const LogoutButton = (props: Props) => {
    const { signOut } = useClerk();

    const handleSignOut = () => {
        signOut()
    }

    return (
        <button onClick={handleSignOut} className='text-xs px-2 py-1 bg-slate-100 border-y drop-shadow-sm p-1 rounded-md hover:bg-slate-50'>Logout</button>
    )
}

export default LogoutButton
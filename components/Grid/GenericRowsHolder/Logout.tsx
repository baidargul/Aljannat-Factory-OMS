'use client'
import { redirectToSignIn, useClerk } from '@clerk/nextjs'
import React from 'react'

type Props = {}

const LogoutComponent = (props: Props) => {

    const { signOut } = useClerk()

    function handleLogout() {
        signOut()
    }
    return (
        <div onClick={() => handleLogout()} className='text-xs scale-90 -ml-1 border-b border-slate-400/30 border-spacing-1 w-fit cursor-pointer hover:tracking-widest transition-all'>
            Logout
        </div>
    )
}

export default LogoutComponent
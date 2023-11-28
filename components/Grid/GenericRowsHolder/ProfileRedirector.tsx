'use client'
import { useRouter } from 'next/navigation'
import React from 'react'

type Props = {
    children: React.ReactNode
}

const ProfileRedirector = (props: Props) => {

    const handleClick= ()=>{
        router.push('/user/account')
    }

    const router=  useRouter()
    return (
        <div className='' onClick={handleClick} >
            {props.children}
        </div>
    )
}

export default ProfileRedirector
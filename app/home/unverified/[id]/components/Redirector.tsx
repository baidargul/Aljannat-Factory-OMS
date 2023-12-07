'use client'
import { Role, profile } from '@prisma/client'
import axios from 'axios'
import { useRouter } from 'next/navigation'
import React, { useEffect, useState } from 'react'
import { toast } from 'sonner'

type Props = {
    profile: profile
}

const Redirector = (props: Props) => {
    const user = props.profile
    const [isVerifed, setIsVerified] = useState(false)
    const router = useRouter()

    useEffect(() => {
        async function checkUserRole() {
            const res: any = await getProfileRole(user.id)
            if (res.data.role !== Role.UNVERIFIED) {
                setIsVerified(true)
                router.push('/')
            }
        }

        const intervalId = setInterval(() => {
            if (isVerifed === false) {
                checkUserRole();
            }
        }, 3000);
        return () => clearInterval(intervalId);
    }, [user.role, router]);

    return (
        <div>
            <div className={`${isVerifed && "bg-green-500 text-xs scale-90 text-white p-1 tracking-wider rounded-md"}`}>{isVerifed ? "VERIFIED" : "..."}</div>
        </div>
    )
}

export default Redirector;


async function getProfileRole(id: string) {
    const data = {
        id
    }
    let response = null
    await axios.post(`/api/profile/`, data).then(async (res) => {
        response = await res.data
    })

    return response
}
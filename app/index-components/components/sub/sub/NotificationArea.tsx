'use client'
import { profile } from "@prisma/client"
import axios from "axios"
import { ChevronRight } from "lucide-react"
import Image from "next/image"
import Link from "next/link"
import { useEffect, useState } from "react"

type pendingUsersType = {
    pendingUsers: profile[] | null

}

type props = {
    pendingUsers: profile[] | null
}

export function NotificationArea(props: props) {
    const [pendingUsers, setPendingUsers] = useState<any>(props.pendingUsers)

    useEffect(() => {
        const timer = setTimeout(async () => {
            await axios.get('/api/user/unverified').then(async (res: any) => {
                const data = await res.data
                if (data.status === 200) {
                    setPendingUsers(data.data)
                }
            })
        }, 1000)

        return () => clearTimeout(timer)
    }, [])

    if (pendingUsers.length < 1) {
        return (
            <div className='text-xs text-slate-500 select-none'>
                <p>No pending users</p>
            </div>
        )
    }
    return (
        <div className='p-2 bg-blue-50 flex flex-col justify-between items-center  rounded-md select-none'>
            <div className=''>
                {
                    pendingUsers && pendingUsers.map((user: any, index: number) => {
                        if (index > 4) {
                            return
                        }

                        if (index === 4) {
                            return (
                                <div className="text-xs text-slate-400 my-2 text-start">
                                    and more...
                                </div>
                            )
                        }
                        return (
                            <div className='flex gap-1 items-center select-none scale-90 justify-start' key={user.name}>
                                <div>
                                    <Image src={user.imageURL ? user.imageURL : '/Placeholders/default.png'} width={30} height={30} alt='userProfile' className='rounded-full' />
                                </div>
                                <p>{user.name}</p>
                            </div>
                        )

                    })
                }
            </div>
            <Link href='/user/dashboard/'>
                <div className='group scale-90 w-full hover:bg-green-50 duration-1000 flex justify-center items-center mt-2 text-slate-500 select-none border-t p-1 bg-white rounded-md drop-shadow-sm cursor-pointer '>
                    <div className='group-hover:font-semibold transition-all duration-500'>
                        See all
                    </div>
                    <div>
                        <ChevronRight size={20} className='group-hover:ml-1 transition-all duration-500' />
                    </div>
                </div>
            </Link>
        </div>
    )
}
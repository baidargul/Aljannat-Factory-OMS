'use client'
import PopoverProvider from '@/components/Popover/PopoverProvider'
import { profile } from '@prisma/client'
import { Bell } from 'lucide-react'
import React, { useEffect, useState } from 'react'
import { NotificationArea } from './sub/NotificationArea'
import axios from 'axios'

type Props = {
    pendingUsers: profile[]
}

const NotificationIcon = (props: Props) => {
    const [pendingUsers, setPendingUsers] = useState<any>(props.pendingUsers)

    useEffect(() => {
        const timer = setTimeout(async () => {
            await axios.get('/api/user/unverified').then(async (res: any) => {
                const data = await res.data
                if (data.status === 200) {
                    setPendingUsers(data.data)
                }
            })
        }, 2000)

        return () => clearTimeout(timer)
    }, [pendingUsers])

    return (
        <PopoverProvider content={<NotificationArea pendingUsers={pendingUsers ? pendingUsers : null} />}>
            <div className='relative text-slate-700 bg-white p-1 rounded-md'>
                <p className={`absolute bg-red-500 text-white text-center text-xs rounded-full scale-75 -right-1 -top-2 w-4 h-4 ${pendingUsers.length <1 ? "hidden" : ""}`}>{pendingUsers.length}</p>
                <Bell size={20} />
            </div>
        </PopoverProvider>
    )
}

export default NotificationIcon

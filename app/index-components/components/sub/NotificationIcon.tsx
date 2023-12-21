import PopoverProvider from '@/components/Popover/PopoverProvider'
import { profile } from '@prisma/client'
import { Bell } from 'lucide-react'
import React from 'react'
import { NotificationArea } from './sub/NotificationArea'

type Props = {
    pendingUsers: profile[]
}

type pendingUsersType = {
    pendingUsers: profile[] | null

}

const NotificationIcon = (props: Props) => {
    return (
        <PopoverProvider content={<NotificationArea pendingUsers={props.pendingUsers ? props.pendingUsers : null} />}>
            <div className='relative text-slate-700 bg-white p-1 rounded-md'>
                <p className={`absolute bg-red-500 text-white text-center text-xs rounded-full scale-75 -right-1 -top-2 w-4 h-4 ${props.pendingUsers.length === 0 ? "hidden" : ""}`}>{props.pendingUsers.length}</p>
                <Bell size={20} />
            </div>
        </PopoverProvider>
    )
}

export default NotificationIcon

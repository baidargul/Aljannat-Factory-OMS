'use client'
import axios from 'axios'
import React, { useEffect, useState } from 'react'
import { toast } from 'sonner'
import Row from './components/Row'
import { Role } from '@prisma/client'

type Props = {
    profile: any
    getPendingUsers: any
}

export let getProfiledUsers: any = null

const Grid = (props: Props) => {
    const [users, setUsers] = useState([])

    const getUsers = async () => {
        await axios.get(`/api/user/all/`).then(async (res: any) => {
            const data = await res.data
            if (data.status === 200) {
                setUsers(data.data)
            } else {
                toast.warning(data.message)
                setUsers([])
            }
        })
    }
    useEffect(() => {
        getProfiledUsers = getUsers
        getUsers()
    }, [])

    if (users.length === 0) return (<div className='text-sm font-sans text-slate-500'>No users available</div>)

    return (
        <div>
            {
                users.map((user: any) => {

                    if (user.role === Role.UNVERIFIED) return null

                    return (
                        <div className='' key={user.id}>
                            <Row user={user} getUsers={getUsers} profile={props.profile} getPendingUsers={props.getPendingUsers} />
                        </div>
                    )
                })
            }
        </div>
    )
}

export default Grid
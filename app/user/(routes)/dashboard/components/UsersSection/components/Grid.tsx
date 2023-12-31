'use client'
import axios from 'axios'
import React, { useEffect, useState } from 'react'
import { toast } from 'sonner'
import Row from './components/Row'

type Props = {}

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
        getUsers()
    }, [])

    if (users.length === 0) return (<div className='text-sm font-sans text-slate-500'>No users available</div>)

    return (
        <div>
            {
                users.map((user: any) => {

                    return (
                        <div className='' key={user.id}>
                            <Row user={user} />
                        </div>
                    )
                })
            }
        </div>
    )
}

export default Grid
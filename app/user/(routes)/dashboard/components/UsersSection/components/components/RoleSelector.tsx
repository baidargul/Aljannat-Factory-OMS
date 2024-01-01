'use client'
import { ComboBoxProvider } from '@/components/ComboBox/ComboBoxProvider'
import ToolTipProvider from '@/components/ToolTipProvider/ToolTipProvider'
import { getCurrentUserCasualStatus, getCurrentUserFormalStatus } from '@/lib/my'
import { Role, profile } from '@prisma/client'
import axios from 'axios'
import { Ban, Check, LoaderIcon, Star, Trash, User2 } from 'lucide-react'
import React, { useEffect } from 'react'
import { toast } from 'sonner'
import { getProfiledUsers } from '../Grid'

type Props = {
    roleMenu: any
    user: any
    getUsers: any
    getPendingUsers: any
}

const RoleSelector = (props: Props) => {
    const [user, setUser] = React.useState<profile>(props.user)
    const [selectedRole, setSelectedRole] = React.useState<string | null>("Unverified")
    const [isWorking, setIsWorking] = React.useState(false)
    const [isRemoving, setIsRemoving] = React.useState(false)
    const [isConfirmed, setIsConfirmed] = React.useState(false)
    const [confirmationText, setConfirmationText] = React.useState('' as string | null)

    useEffect(() => {
        setIsConfirmed(false)
        setConfirmationText('')
    }, [selectedRole])

    useEffect(() => {
        const status: any = getCurrentUserCasualStatus(user.role)
        setSelectedRole(status)
    }, [user])

    function setRole(selected: string) {
        setSelectedRole(selected)
    }

    let isMajor
    if (getCurrentUserFormalStatus(selectedRole || "Unverified") === Role.ADMIN || getCurrentUserFormalStatus(selectedRole || "Unverified") === Role.SUPERADMIN) {
        isMajor = true
    }

    async function accept() {
        setIsWorking(true)
        try {
            const data = {
                user: user,
                role: getCurrentUserFormalStatus(selectedRole as Role)
            }
            setIsRemoving(false)
            await axios.patch(`/api/user/role/update/`, data).then(async (res: any) => {
                const data: any = res.data
                if (data.status === 200) {
                    toast.success('User role updated')
                    props.getUsers()
                    setIsConfirmed(true)
                    setConfirmationText('Updated')
                    props.getPendingUsers()
                } else {
                    toast.error(data.message)
                    setIsConfirmed(false)
                    setConfirmationText('')
                }
            })
        } catch (e: any) {
            toast.error(e.message)
        }
        setIsWorking(false)
    }

    async function reject() {
        try {
            const data = {
                user: user
            }
            setIsRemoving(true)
            await axios.post(`/api/user/role/delete/`, data).then(async (res) => {
                const data = await res.data
                if (data.status === 200) {
                    toast.success('User removed.')
                    setIsConfirmed(true)
                    setConfirmationText('Removed')
                    props.getPendingUsers()
                    getProfiledUsers()
                } else {
                    toast.error(data.message)
                    setIsConfirmed(false)
                    setConfirmationText('')
                }
            })
        } catch (e: any) {
            toast.error(e.message)
        }
        setIsRemoving(false)
    }

    return (
        <div className='flex justify-between'>
            <div className=''>
                <ComboBoxProvider placeholder='User role' setValue={setRole} content={props.roleMenu} returnLabel>
                    <div className='flex gap-1 items-center px-2 py-1'>
                        <div className=''>
                            {isMajor && <Star className='w-4 h-4 text-yellow-500' />}
                            {!isMajor && <User2 className='w-4 h-4 text-slate-700' />}
                        </div>
                        <ToolTipProvider content={selectedRole || "Select Role"}>
                            <div className='truncate w-24'>
                                {selectedRole ? selectedRole : "Select Role"}
                            </div>
                        </ToolTipProvider>
                    </div>
                </ComboBoxProvider>
            </div>
            <div className='flex justify-center items-center text-sm'>
                {
                    <div className='flex gap-1 items-center'>
                        <div onClick={async () => await accept()} className='flex items-center border drop-shadow-sm bg-white rounded w-28 justify-center hover:bg-slate-50 active:bg-green-50'>
                            {isWorking && <LoaderIcon cursor-pointer className='w-5 h-5 text-green-500 animate-spin duration-1000' />}
                            {!isWorking && <Check cursor-pointer className='w-6 h-6 text-green-500' />}
                            <button className=' text-slate-700 rounded-md p-1'>Save</button>
                        </div>
                        <div onClick={async () => await reject()} className='flex items-center border drop-shadow-sm bg-white rounded w-32 justify-center hover:bg-slate-50 active:bg-red-50'>
                            <Trash className={`w-5 h-5 text-red-500 cursor-pointer ${isRemoving && "animate-pulse"}`} />
                            <button className=' text-slate-700 rounded-md p-1'>Remove</button>
                        </div>
                    </div>
                }
            </div>
        </div>
    )
}

export default RoleSelector
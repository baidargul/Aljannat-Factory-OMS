'use client'
import { ComboBoxProvider } from '@/components/ComboBox/ComboBoxProvider'
import ToolTipProvider from '@/components/ToolTipProvider/ToolTipProvider'
import { getCurrentUserCasualStatus, getCurrentUserFormalStatus } from '@/lib/my'
import { Role, profile } from '@prisma/client'
import axios from 'axios'
import { Ban, Check, LoaderIcon, Star, User2 } from 'lucide-react'
import React, { useEffect } from 'react'
import { toast } from 'sonner'

type Props = {
    roleMenu: any
    user: profile
}

const RoleSelector = (props: Props) => {
    const [user, setUser] = React.useState<profile>(props.user)
    const [selectedRole, setSelectedRole] = React.useState<string | null>("Unverified")
    const [isWorking, setIsWorking] = React.useState(false)
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
            await axios.patch(`/api/user/role/update/`, data).then(async (res: any) => {
                const data: any = res.data
                console.log(data)
                if (data.status === 200) {
                    toast.success('User accepted.')
                    setIsConfirmed(true)
                    setConfirmationText('Accepted')
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
        // try {
        //     await axios.delete(`/api/user/${props.userId}/role`)
        //     toast.success('User rejected.')
        // } catch (e: any) {
        //     toast.error(e.message)
        // }
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
                    !isConfirmed ? (
                        <div className='flex gap-1 items-center'>
                            <div onClick={async () => await accept()} className='flex items-center border drop-shadow-sm bg-white rounded w-32 justify-center hover:bg-slate-50 active:bg-green-50'>
                                {isWorking && <LoaderIcon cursor-pointer className='w-5 h-5 text-green-500 animate-spin duration-1000' />}
                                {!isWorking && <Check cursor-pointer className='w-6 h-6 text-green-500' />}
                                <button className=' text-slate-700 rounded-md p-1'>Accept</button>
                            </div>
                            <div onClick={async () => await reject()} className='flex items-center border drop-shadow-sm bg-white rounded w-32 justify-center hover:bg-slate-50 active:bg-red-50'>
                                <Ban className='w-5 h-5 text-red-500 cursor-pointer' />
                                <button className=' text-slate-700 rounded-md p-1'>Reject</button>
                            </div>
                        </div>
                    ) : (
                        <div className='bg-green-50 text-green-600 p-1 rounded-md w-32 text-center border border-green-200'>
                            {
                                confirmationText && (
                                    <div className=''>
                                        {confirmationText}
                                    </div>
                                )
                            }
                        </div>
                    )
                }
            </div>
        </div>
    )
}

export default RoleSelector
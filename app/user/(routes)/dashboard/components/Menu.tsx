'use client'
import { formalizeText, getCurrentUserCasualStatus } from '@/lib/my'
import { redirectToSignIn, useClerk } from '@clerk/nextjs'
import { Role, profile, settings } from '@prisma/client'
import axios from 'axios'
import { ChevronLeft, ChevronRight, Globe, LogOut, Mail, ShoppingBag, Trash, User, User2 } from 'lucide-react'
import Image from 'next/image'
import React, { useEffect, useState } from 'react'
import { toast } from 'sonner'
import RoleSelector from './sub/RoleSelector'
import OrderNotes from './sub/OrderNotes'
import Link from 'next/link'
import { redirect, useRouter } from 'next/navigation'
import Setting from './GlobalMenu/SettingList/SettingList'
import SettingList from './GlobalMenu/SettingList/SettingList'
import UsersSection from './UsersSection/UsersSection'

type Props = {
    profile: any
}

const menu = [
    {
        name: "personal",
        label: "Personal",
        icon: <User2 />,
    },
    {
        name: "global",
        label: "Global",
        icon: <Globe />,
    },
    {
        name: "orders",
        label: "Orders",
        icon: <ShoppingBag />,
    },
    {
        name: "users",
        label: "Users",
        icon: <User />,
    },
]

const roleMenu = [
    {
        name: Role.ADMIN,
        label: "Admin"
    },
    {
        name: Role.DISPATCHER,
        label: "Dispatcher"
    },
    {
        name: Role.INVENTORYMANAGER,
        label: "Inventory Manager"
    },
    {
        name: Role.MANAGER,
        label: "Manager"
    },
    {
        name: Role.ORDERBOOKER,
        label: "Order Booker"
    },
    {
        name: Role.ORDERVERIFIER,
        label: "Order Verifier"
    },
    {
        name: Role.PAYMENTVERIFIER,
        label: "Payment Verifier"
    },
    {
        name: Role.SUPERADMIN,
        label: "Super Admin"
    },
    {
        name: Role.UNVERIFIED,
        label: "Unverified"
    }
]

const Menu = (props: Props) => {
    const [isMounted, setIsMounted] = useState(false)
    const [selectedMenu, setSelectedMenu] = useState(menu[0].name)

    useEffect(() => {
        setIsMounted(true)
    }, [])




    return (
        isMounted && <div className='select-none'>
            <div className={`flex justify-between items-center text-slate-700 p-1 font-semibold`}>
                {
                    menu.map((item, index) => {
                        return (
                            <div onClick={() => setSelectedMenu(item.name)} key={index} className={`flex gap-2 items-center p-1  cursor-pointer rounded-md transition-all duration-300   ${selectedMenu === item.name ? "bg-gradient-to-b from-slate-50 to-slate-100 text-black border-zinc-600/50 drop-shadow-sm" : "hover:bg-slate-100"}`}>
                                <div>
                                    {
                                        item.icon
                                    }
                                </div>
                                <div>
                                    {
                                        item.label
                                    }
                                </div>
                            </div>
                        )
                    })
                }
            </div>
            <div className='h-[400px]'>
                {
                    getMenuComponent(selectedMenu, props.profile)
                }
            </div>
        </div>
    )
}

export default Menu

function getMenuComponent(selectedMenu: any, profile: profile) {
    if (!profile) return <div>No Logged In User</div>
    switch (selectedMenu) {
        case "personal":
            return <PersonalMenu profile={profile} />
        case "global":
            return <GlobalMenu profile={profile} />
        case "orders":
            return <OrdersMenu profile={profile} />
        case "users":
            return <PendingUsers profile={profile} />
        default:
            break;
    }
}

function PersonalMenu(profile: any) {
    const { signOut } = useClerk()

    const deleteAccount = async (user: any) => {
        const data = {
            user: user
        }
        await axios.post(`/api/user/role/delete`, data).then(async (res) => {
            const data = await res.data
            if (data.status === 200) {
                toast.success(data.message)
                signOut()
            } else {
                toast.error(data.message)
            }
        }).catch((error => {
            toast.error(error.message)
        }))
    }


    return (
        <div className='flex gap-2 justify-between items-center bg-gradient-to-b from-slate-50 to-slate-200 p-2 w-full'>
            <div className='group flex gap-2 py-28 w-[36%] justify-center items-center text-zinc-700 drop-shadow-sm rounded-md bg-white border transition-all duration-500'>
                <Link href={`/user/account/${profile.profile.userId}`}>
                    <div className='flex gap-2 items-center'>
                        <div className='text-4xl font-semibold group-hover:rotate-180 opacity-100 transition-all duration-1000 group-hover:opacity-0'>
                            <ChevronRight size={30} className='text-zinc-500' />
                        </div>
                        <div className='text-zinc-500 group-hover:tracking-tight transition-all duration-500 text-4xl font-semibold'>
                            Profile
                        </div>
                        <div className='text-4xl font-semibold mt-1 group-hover:animate-pulse  group-hover:rotate-180 opacity-0 transition-all duration-1000 group-hover:opacity-100'>
                            <ChevronLeft size={30} className='text-zinc-500' />
                        </div>
                    </div>
                </Link>
            </div>
            <div className='grid grid-cols-3 justify-center justify-items-center place-items-center gap-2'>
                <div className='flex flex-col h-full justify-center items-center text-zinc-700 w-80 py-4 drop-shadow-sm rounded-md bg-white border'>
                    <div>
                        <Image src={profile.profile.imageURL ? profile.profile.imageURL : "/Placeholders/default.png"} width={150} height={150} alt='loggedInUser' className='rounded-md' />
                    </div>
                    <div className='font-semibold text-lg'>
                        {profile.profile.name}
                    </div>
                    <div className='text-sm text-zinc-400'>
                        {new Date(profile.profile.createdAt).toDateString() + " " + new Date(profile.profile.createdAt).toLocaleTimeString()}
                    </div>
                </div>
                <div className='flex flex-col h-full justify-center items-center text-zinc-700 w-80 py-4 drop-shadow-sm rounded-md bg-white border'>
                    <div className='font-semibold pb-1 border-b mb-10'>
                        Your role
                    </div>
                    <div className='flex gap-1 items-center'>
                        <Mail className='w-4 h-4' />
                        {
                            formalizeText(profile.profile.email)
                        }
                    </div>
                    <div className='font-semibold text-sm text-zinc-400'>
                        {
                            getCurrentUserCasualStatus(profile.profile.role)
                        }
                    </div>
                </div>
                <div className='flex flex-col h-full justify-center items-center text-zinc-700 w-80 py-4 drop-shadow-sm rounded-md bg-white border'>
                    <div className='font-semibold pb-1 border-b mb-10'>
                        Actions
                    </div>
                    <div className='flex flex-col gap-2'>
                        <div onClick={() => deleteAccount(profile.profile)} className='flex gap-1 items-center w-36 p-1 text-sm text-slate-400 border-b border-transparent hover:border-slate-200 hover:text-slate-700 transition-all duration-700 hover:drop-shadow-sm rounded-md'>
                            <Trash className='w-4 h-4' />
                            <button>Delete Account</button>
                        </div>
                        <div onClick={() => signOut()} className='flex gap-1 items-center w-36 p-1 text-sm text-slate-400 border-b border-transparent hover:border-slate-200 hover:text-slate-700 transition-all duration-700 hover:drop-shadow-sm rounded-md'>
                            <LogOut className='w-4 h-4' />
                            <button>Logout</button>
                        </div>
                    </div>
                </div>
            </div>

        </div>
    )
}

const PendingUsers = (profile: any) => {
    const [pendingUsers, setPendingUsers] = useState<any>([])

    useEffect(() => {
        getPendingUsers()
    }, [])

    async function getPendingUsers() {
        axios.get('/api/user/unverified/').then(async (res) => {
            const response = res.data
            if (response.status === 200) {
                setPendingUsers(response.data)
            }
        }).catch((error: any) => {
            setPendingUsers(null)
            toast.error(error.message)
        })
    }


    return (
        <div>

            <div className=' bg-slate-100 p-2 border w-full'>
                <div className='font-semibold text-md text-slate-700 tracking-tight'>
                    Pending users:
                </div>
                <div className='w-full p-1'>
                    {
                        pendingUsers && pendingUsers.length > 0 ? pendingUsers.map((user: any, index: number) => {
                            return (
                                <div className='grid grid-cols-4 justify-items-start w-full text-slate-700 items-center bg-slate-50 border border-slate-100 p-1'>
                                    <div className=''>
                                        <div className='flex gap-3 justify-center items-center font-semibold w-32 truncate'>
                                            <Image src={user.imageURL ? user.imageURL : "/Placeholders/default.png"} width={50} height={50} alt='loggedInUser' className='rounded-full w-8 h-8' />
                                            <div>{user.name}</div>
                                        </div>
                                    </div>
                                    <div className='font-semibold truncate text-sm'>
                                        {user.email}
                                    </div>
                                    <div className='font-sans truncate text-sm scale-90 uppercase'>
                                        {user.userId}
                                    </div>
                                    <div className='ml-auto'>
                                        <RoleSelector user={user} roleMenu={roleMenu} />
                                    </div>
                                </div>
                            )
                        }) : <div className='text-sm font-sans text-slate-500'>No Pending Users</div>
                    }
                </div>
            </div>
            <div>
                <UsersSection profile={profile}/>
            </div>
        </div>
    )
}

const OrdersMenu = (profile: any) => {
    const [isWorking, setIsWorking] = useState(false)
    return (
        <div className='bg-slate-100 p-2 w-full'>
            <div className='font-semibold text-md text-slate-700 tracking-tight mb-4'>
                {isWorking ? "Loading orders" : "Orders processing:"}
            </div>
            <div>
                <OrderNotes setWorking={setIsWorking} profile={profile.profile} />
            </div>
        </div>
    )
}

const GlobalMenu = (profile: any) => {
    const [settingList, setSettingList] = useState([])

    const fetchSettings = async () => {
        await axios.get('/api/settings/list').then(async (res) => {
            const response = await res.data
            if (response.status === 200) {
                setSettingList(response.data)
            }
        }).catch((error) => {
            toast.error(error.message)
        })
    }

    useEffect(() => {
        fetchSettings()
    }, [])


    return (
        <div className='p-2 bg-slate-100'>
            <SettingList settingList={settingList} fetchSettings={fetchSettings} />
        </div>
    )
}
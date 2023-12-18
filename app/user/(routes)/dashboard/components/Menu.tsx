'use client'
import { formalizeText, getCurrentUserCasualStatus } from '@/lib/my'
import { useClerk } from '@clerk/nextjs'
import { profile } from '@prisma/client'
import { Globe, LogOut, Mail, PaintBucket, PersonStanding, ShoppingBag, Trash, User, User2 } from 'lucide-react'
import Image from 'next/image'
import React, { useEffect, useState } from 'react'

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
                            <div onClick={() => setSelectedMenu(item.name)} key={index} className={`flex gap-2 items-center p-1  cursor-pointer rounded-md  ${selectedMenu === item.name && "bg-zinc-500 text-white border border-zinc-600/50 drop-shadow-sm"}`}>
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
            <div>
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
            break;
        case "orders":
            break;
        case "users":
            break;
        default:
            break;
    }
}

function PersonalMenu(profile: any) {

    const { signOut } = useClerk()

    return (
        <div className='bg-slate-100 p-2 grid grid-cols-3 justify-center items-center w-full gap-2'>
            <div className='flex flex-col h-full justify-center items-center text-zinc-700 px-20 py-4 drop-shadow-sm rounded-md bg-white border w-fit'>
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
            <div className='flex flex-col h-full justify-center items-center text-zinc-700 px-20 py-4 drop-shadow-sm rounded-md bg-white border w-fit'>
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

            <div className='flex flex-col h-full justify-center items-center text-zinc-700 px-20 py-4 drop-shadow-sm rounded-md bg-white border w-fit'>
                <div className='font-semibold pb-1 border-b mb-10'>
                    Actions
                </div>
                <div className='flex flex-col gap-2'>
                    <div className='flex gap-1 items-center w-36 p-1 text-sm text-slate-400 border-b border-transparent hover:border-slate-200 hover:text-slate-700 transition-all duration-700 hover:drop-shadow-sm rounded-md'>
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
    )
}
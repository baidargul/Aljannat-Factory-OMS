import { formalizeText, getCurrentUserCasualStatus } from '@/lib/my'
import Image from 'next/image'
import React from 'react'

type Props = {
    user: any
}

const Row = (props: Props) => {
    const user = props.user

    return (
        <div className='bg-white p-1 border border-slate-100 drop-shadow-sm text-sm'>
            <div className='grid grid-cols-4'>
                <div className='flex gap-1 items-center'>
                    <Image src={user.imageURL} alt='user image' width={40} height={40} className='rounded-md' />
                    <div className=''>
                        <h1>{user.name}</h1>
                        <div className='text-xs'>{user.email}</div>
                    </div>
                </div>
                <div>
                    <div>Created on:</div>
                    <div className='text-xs'>
                        {new Date(user.createdAt).toDateString()}
                    </div>
                </div>
                <div>
                    <div>Current role:</div>
                    <div>{getCurrentUserCasualStatus(user.role)}</div>
                </div>
                <div>
                    <div>Interactions:</div>
                    <div className='bg-slate-100 p-1 rounded-md w-fit text-center scale-90 flex gap-1'>on <p className='font-semibold'>{user.orderNotes.length}</p> orders</div>
                </div>
                <div>
                    
                </div>
            </div>
        </div>
    )
}

export default Row
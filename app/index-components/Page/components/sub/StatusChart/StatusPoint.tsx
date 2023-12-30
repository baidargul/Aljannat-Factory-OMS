import React from 'react'

type Props = {
    item: any
}

const StatusPoint = (props: Props) => {
    return (
        <div className='bg-gradient-to-b from-slate-50 to-slate-100 p-10 w-40 h-32 rounded-md drop-shadow-sm text-center border-b border-slate-200'>
            <div className='flex flex-col  justify-between items-center gap-2'>
                <div className='text-xs font-semibold'>
                    {props.item.name}
                </div>
                <div className='flex gap-1 items-center bg-gradient-to-b from-slate-100 to-slate-200 border-b border-slate-200 p-1 rounded-md w-fit'>
                    <div className='text-2xl'>
                        {props.item.inWork}
                    </div>
                    <div>
                        {`/${props.item.order}`}
                    </div>
                </div>
            </div>
        </div>
    )
}

export default StatusPoint
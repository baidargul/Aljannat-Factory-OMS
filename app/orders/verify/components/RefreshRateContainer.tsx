'use client'
import { Input } from '@/components/ui/input'
import { Setting_FETCH, Setting__WRITE } from '@/lib/settings'
import { Info } from 'lucide-react'
import React, { useEffect } from 'react'
import { toast } from 'sonner'

type Props = {}

const RefreshRateContainer = (props: Props) => {
    const [isMounted, setIsMounted] = React.useState(false)
    const [requireReload, setRequireReload] = React.useState(false)
    const [refreshRate, setRefreshRate] = React.useState(30)

    useEffect(() => {
       
        setRequireReload(false)
        setIsMounted(true)
    }, [])

    useEffect(()=>{
        const test = async () => await Setting_FETCH("refreshgrid").then(async (res) => {
            const data = await res.data
            const refreshRate = Number(data?.value1)
            setRefreshRate(refreshRate)

        })
        test()
    },[isMounted])

    async function setRefreshRateHandler() {
        await Setting__WRITE("refreshgrid", String(refreshRate)).then(async (res) => {
            const data: any = await res.data
            if (data) {
                toast.success(`Refresh rate updated!`)
                setRequireReload(true)
            } else {
                setRequireReload(false)
                toast.error(data.message)
            }
        })
    }

    return (
        <div className='flex flex-col gap-1 text-xs my-5'>
            <div>
                <div className={``}>
                    Refresh rate: (In seconds)
                </div>
                {
                    requireReload && <div className={`text-xs scale-90 -ml-3 text-red-800 font-semibold flex gap-1`}>
                        <Info size={16} className='inline' />
                        Page Refresh Required
                    </div>
                }
            </div>
            <div className='flex gap-1'>
                {isMounted && <Input disabled={!isMounted} type='number' placeholder='30 seconds' value={refreshRate} onChange={(e: any) => { setRefreshRate(e.target.value) }} />}
                <button onClick={() => setRefreshRateHandler()} disabled={!isMounted} className='bg-slate-100 rounded-md px-2 py-1 hover:bg-slate-50 border drop-shadow-sm cursor-pointer disabled:bg-orange-500'>Set</button>
            </div>
        </div>
    )
}

export default RefreshRateContainer
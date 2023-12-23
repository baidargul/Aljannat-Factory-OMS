import { Input } from '@/components/ui/input'
import { settings } from '@prisma/client'
import React, { useEffect } from 'react'
import Setting from './Setting'

type Props = {
    settingList: any
}

const SettingList = (props: Props) => {
    const [settingList, setSettingList] = React.useState<any>(props.settingList)

    useEffect(() => {
        setSettingList(props.settingList)
    }, [props.settingList])


    return (
        <table className='w-full'>
            <thead>
                <tr>
                    <th className='border text-start pl-2 bg-zinc-600 text-white tracking-wide'>Name</th>
                    <th className='border text-start pl-2 bg-zinc-600 text-white tracking-wide'>Value 1</th>
                    <th className='border text-start pl-2 bg-zinc-600 text-white tracking-wide'>Value 2</th>
                    <th className='border text-start pl-2 bg-zinc-600 text-white tracking-wide'>Value 3</th>
                    <th className='border text-end pr-4 bg-zinc-600 text-white tracking-wide'>Actions</th>
                </tr>
            </thead>
            <tbody>
                {
                    settingList.map((setting: settings) => {
                        return (
                                <Setting setting={setting} />
                        )
                    })
                }
            </tbody>
        </table>
    )
}

export default SettingList
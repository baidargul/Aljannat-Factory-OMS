import { Input } from '@/components/ui/input'
import { settings } from '@prisma/client'
import React, { useEffect } from 'react'
import Setting from './Setting'
import { Plus } from 'lucide-react'
import axios from 'axios'
import { toast } from 'sonner'
import { v4 } from 'uuid'

type Props = {
    settingList: any
    fetchSettings: any
}

const SettingList = (props: Props) => {
    const [settingList, setSettingList] = React.useState<any>(props.settingList)
    const [isOnRow, setIsOnRow] = React.useState<number>()

    useEffect(() => {
        setSettingList(props.settingList)
    }, [props.settingList])

    useEffect(() => {

        const inte = setInterval(() => {
            setIsOnRow(-1)
        }, 5000)

        return () => {
            clearInterval(inte)
        }
    }, [isOnRow])

    const addSettingClick = async () => {
        const data = {
            name: v4(),
            value1: 'New value 1',
            value2: 'New value 2',
            value3: 'New value 3',
        }

        await axios.post('/api/settings/create/', data).then(async (res: any) => {
            const data = await res.data
            if (data.status === 200) {
                props.fetchSettings()
                toast.success('Successfully created setting')
            } else {
                toast.error(data.message)
            }
        }).catch((err) => {
            toast.error(`Server error: ${err.message}`)
        })

        props.fetchSettings()
    }


    return (
        <div>
            <table className='w-full'>
                <thead>
                    <tr>
                        <th className='border text-start pl-2 p-2 bg-zinc-600 text-white tracking-wide'>Name</th>
                        <th className='border text-start pl-2 p-2 bg-zinc-600 text-white tracking-wide'>Value 1</th>
                        <th className='border text-start pl-2 p-2 bg-zinc-600 text-white tracking-wide'>Value 2</th>
                        <th className='border text-start pl-2 p-2 bg-zinc-600 text-white tracking-wide'>Value 3</th>
                        <th className='border text-center pr-4 p-2 bg-zinc-600 text-white tracking-wide'>Actions</th>
                    </tr>
                </thead>
                <tbody>
                    {
                        settingList.map((setting: settings, index: number) => {
                            return (
                                <Setting setting={setting} fetchSettings={props.fetchSettings} setIsOnRow={setIsOnRow} rowIndex={index} />
                            )
                        })
                    }
                </tbody>
            </table>
            {(isOnRow === settingList.length - 1) && <div onClick={addSettingClick} className='cursor-pointer'>
                <div className='bg-green-400 w-full h-1 rounded-b'>
                </div>
                <div className='bg-green-100 w-full text-green-700 border-b border-green-400 rounded-md text-center p-1 '>
                    <Plus className='inline-block w-5 h-5 mr-2' />
                </div>
            </div>}
        </div>
    )
}

export default SettingList
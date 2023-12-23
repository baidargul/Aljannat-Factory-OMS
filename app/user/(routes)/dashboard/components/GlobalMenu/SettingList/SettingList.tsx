import { Input } from '@/components/ui/input'
import { settings } from '@prisma/client'
import React, { useEffect } from 'react'
import Setting from './Setting'
import { Plus } from 'lucide-react'
import axios from 'axios'
import { toast } from 'sonner'
import { v4 } from 'uuid'
import DialogProvider from '@/components/DialogProvider/DialogProvider'

type Props = {
    settingList: any
    fetchSettings: any
}

const SettingList = (props: Props) => {
    const [settingList, setSettingList] = React.useState<any>(props.settingList)
    const [newSettingName, setNewSettingName] = React.useState<string>('')
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

        if (!newSettingName) return

        const data = {
            name: newSettingName,
            value1: '',
            value2: '',
            value3: '',
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

    const addSettingDialog = () => {
        const [name, setName] = React.useState<string>('')

        useEffect(() => {
            setNewSettingName(name)
        }, [name])

        const handleKeyDown = (e: any) => {
            if (e.key === 'Enter') {
                addSettingClick()
            }
        }

        return (
            <div className='flex gap-1 items-center'>
                <Input onKeyDown={handleKeyDown} value={name} onChange={(e: any) => setName(e.target.value)} />
            </div>
        )
    }

    function dialogCloseButton() {
        return (
            <div className='flex justify-end items-center'>
                <button className='bg-slate-100 border rounded-md p-1 hover:bg-slate-100/40'>Cancel</button>
            </div>
        )
    }

    const dialogAcceptButton = () => {

        return (
            <div className='flex justify-end items-center'>
                <button onClick={addSettingClick} className='bg-slate-100 border rounded-md p-1 hover:bg-slate-100/40'>Create</button>
            </div>
        )
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
            <div className='w-full'>
                <DialogProvider acceptButton={dialogAcceptButton()} closeButton={dialogCloseButton()} content={addSettingDialog()} description='New setting name:' title='Create Setting' >
                    {(isOnRow === settingList.length - 1) && (
                        <div className='cursor-pointer w-full'>
                            <div className='bg-green-400 w-full h-1 rounded-b'>
                            </div>
                            <div className='bg-green-100 w-full text-green-700 border-b border-green-400 rounded-md text-center p-1 '>
                                <Plus className='inline-block w-5 h-5 mr-2' />
                            </div>
                        </div>)
                    }
                </DialogProvider>
            </div>
        </div>
    )
}

export default SettingList


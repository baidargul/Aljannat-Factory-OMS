import { Input } from '@/components/ui/input'
import { settings } from '@prisma/client'
import { Save, Trash } from 'lucide-react'
import React, { useEffect } from 'react'
import InputBar from './Setting/InputBar'
import axios from 'axios'
import { toast } from 'sonner'

type Props = {
    setting: settings
    fetchSettings: any
}


const Setting = (props: Props) => {
    const [setting, setSetting] = React.useState<settings>(props.setting)
    const [selectedValue, setSelectedValue] = React.useState<any>()
    const [isValueChanged, setIsValueChanged] = React.useState<boolean>(false)

    useEffect(() => {
        setSetting(props.setting)
    }, [props.setting])

    function handleValueDoubleClick(index: number) {
        setSelectedValue(index)
    }

    const handleDelete = async () => {
        const data = {
            id: setting.id
        }
        await axios.post('/api/settings/delete/', data).then(async (res) => {
            const data = await res.data
            if (data.status === 200) {
                props.fetchSettings()
                toast.success('Successfully deleted setting')
            } else {
                toast.error(data.message)
            }
        }).catch((err) => {
            toast.error(`Server error: ${err.message}`)
        })

        props.fetchSettings()
    }

    useEffect(() => {
        props.fetchSettings()
        setIsValueChanged(false)
    }, [isValueChanged])

    return (
        <tr key={setting.id} className='group'>
            <td className='border pl-3 p-2 group-hover:bg-yellow-50/60 '>{setting.name}</td>
            <td onDoubleClick={() => handleValueDoubleClick(1)} className='border pl-3 p-2 group-hover:bg-yellow-50/60 '>
                {selectedValue === 1 ? <InputBar name={setting.name} index={1} prevValue={setting.value1 || ""} setSelectedValue={setSelectedValue} setIsValueChanged={setIsValueChanged} /> : setting.value1}
            </td>
            <td onDoubleClick={() => handleValueDoubleClick(2)} className='border pl-3 p-2 group-hover:bg-yellow-50/60 '>
                {selectedValue === 2 ? <InputBar name={setting.name} index={2} prevValue={setting.value2 || ""} setSelectedValue={setSelectedValue} setIsValueChanged={setIsValueChanged} /> : setting.value2}
            </td>
            <td onDoubleClick={() => handleValueDoubleClick(3)} className='border pl-3 p-2 group-hover:bg-yellow-50/60 '>
                {selectedValue === 3 ? <InputBar name={setting.name} index={3} prevValue={setting.value3 || ""} setSelectedValue={setSelectedValue} setIsValueChanged={setIsValueChanged} /> : setting.value3}
            </td>
            <td className='border pr-3 p-2 group-hover:bg-yellow-50/60  flex gap-4 items-center justify-end'>
                <button onClick={handleDelete} className='bg-slate-100 group-hover:bg-red-50 hover:bg-red-500 border rounded px-2 py-1 w-24 flex gap-1 items-center'>
                    <div className='fill-red-50'>
                        <Trash size={16} />
                    </div>
                    <div>
                        Delete
                    </div>
                </button>
            </td>
        </tr>
    )
}

export default Setting

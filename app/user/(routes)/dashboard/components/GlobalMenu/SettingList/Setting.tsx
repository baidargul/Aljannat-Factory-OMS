import { Input } from '@/components/ui/input'
import { settings } from '@prisma/client'
import { Save, Trash } from 'lucide-react'
import React, { useEffect } from 'react'
import InputBar from './Setting/InputBar'

type Props = {
    setting: settings
}


const Setting = (props: Props) => {
    const [setting, setSetting] = React.useState<settings>(props.setting)
    const [selectedValue, setSelectedValue] = React.useState<any>()

    useEffect(() => {
        setSetting(props.setting)
    }, [props.setting])

    function handleValueDoubleClick(index: number) {
        setSelectedValue(index)
    }


    return (
        <tr key={setting.id} className='group'>
            <td className='border pl-3 p-2 group-hover:bg-yellow-50/60 '>{setting.name}</td>
            <td onDoubleClick={() => handleValueDoubleClick(1)} className='border pl-3 p-2 group-hover:bg-yellow-50/60 '>
                {selectedValue === 1 ? setting.value1 && <InputBar index={1} prevValue={setting.value1} setSelectedValue={setSelectedValue} /> : setting.value1}
            </td>
            <td onDoubleClick={() => handleValueDoubleClick(2)} className='border pl-3 p-2 group-hover:bg-yellow-50/60 '>
                {selectedValue === 2 ? setting.value2 && <InputBar index={2} prevValue={setting.value2} setSelectedValue={setSelectedValue} /> : setting.value2}
            </td>
            <td onDoubleClick={() => handleValueDoubleClick(3)} className='border pl-3 p-2 group-hover:bg-yellow-50/60 '>
                {selectedValue === 3 ? setting.value3 && <InputBar index={3} prevValue={setting.value3} setSelectedValue={setSelectedValue} /> : setting.value3}
            </td>
            <td className='border pr-3 p-2 group-hover:bg-yellow-50/60  flex gap-4 items-center justify-end'>
                <button className='bg-slate-100 group-hover:bg-green-50 hover:bg-red-500 border rounded px-2 py-1 w-24 flex gap-1 items-center'>
                    <div className='fill-red-50'>
                        <Save size={16} />
                    </div>
                    <div>
                        Save
                    </div>
                </button>
                <button className='bg-slate-100 group-hover:bg-red-50 hover:bg-red-500 border rounded px-2 py-1 w-24 flex gap-1 items-center'>
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

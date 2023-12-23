import { settings } from '@prisma/client'
import React, { useEffect } from 'react'

type Props = {
    setting: settings
}

const Setting = (props: Props) => {
    const [setting, setSetting] = React.useState<settings>(props.setting)

    useEffect(() => {
        setSetting(props.setting)
    }, [props.setting])

    return (
        <tr key={setting.id}>
            <td className='border pl-2'>{setting.name}</td>
            <td className='border pl-2'>{setting.value1}</td>
            <td className='border pl-2'>{setting.value2}</td>
            <td className='border pl-2'>{setting.value3}</td>
            <td className='border pr-2 flex gap-1 items-center justify-end'>
                <button className='bg-slate-700 text-white rounded px-2 py-1'>Save</button>
                <button className='bg-slate-700 text-white rounded px-2 py-1'>Delete</button>
            </td>
        </tr>
    )
}

export default Setting
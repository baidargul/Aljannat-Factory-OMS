import { Input } from '@/components/ui/input'
import axios from 'axios'
import React, { useEffect, useRef } from 'react'
import { toast } from 'sonner'

type Props = {
    index: number,
    name: string,
    prevValue: string
    setSelectedValue: any
    setIsValueChanged: any
}

const InputBar = (props: Props) => {
    const ref = useRef<HTMLInputElement>(null)
    const [index, setIndex] = React.useState<number>(props.index)
    const [value, setValue] = React.useState<string>(props.prevValue);

    useEffect(() => {
        ref.current?.focus()
        ref.current?.select()
    }, [])

    const handleKeyDown = async (e: any) => {
        if (e.key === 'Escape') {
            props.setSelectedValue(null)
        } else if (e.key === 'Enter') {

            const data = {
                method: "WRITE",
                name: props.name,
                [index === 1 ? "value1" : index === 2 ? "value2" : "value3"]: value ? value : "[/BLANK]",
            }

            await axios.post('/api/settings/get/', data).then(async (res) => {
                const data = await res.data
                if (data.status === 200) {
                    props.setIsValueChanged(true)
                    toast.success('Successfully updated setting')
                } else {
                    toast.error(data.message)
                }
            }).catch((err) => {
                toast.error(`Server error: ${err.message}`)
            })

            props.setSelectedValue(null)
        }
    }

    return (
        <Input onBlur={() => props.setSelectedValue(null)} onKeyDown={handleKeyDown} onClick={() => ref.current?.select()} ref={ref} value={value} onChange={(e: any) => setValue(e.target.value)} className='w-28 h-8' />
    );
}

export default InputBar
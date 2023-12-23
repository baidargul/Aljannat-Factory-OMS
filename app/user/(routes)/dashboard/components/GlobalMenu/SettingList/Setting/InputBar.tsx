import { Input } from '@/components/ui/input'
import React, { useEffect, useRef } from 'react'

type Props = {
    index: number,
    prevValue: string
    setSelectedValue: any
}

const InputBar = (props: Props) => {
    const ref = useRef<HTMLInputElement>(null)
    const [index, setIndex] = React.useState<number>(props.index)
    const [prevValue, setPrevValue] = React.useState<string>(props.prevValue)
    const [value, setValue] = React.useState<string>(props.prevValue);

    useEffect(() => {
        ref.current?.focus()
        ref.current?.select()
    }, [])

    const handleKeyDown = (e: any) => {
        if (e.key === 'Escape') {
            props.setSelectedValue(null)
        } else if (e.key === 'Enter') {
            console.log(value)
            props.setSelectedValue(null)
        }
    }

    return (
        <Input onBlur={() => props.setSelectedValue(null)} onKeyDown={handleKeyDown} onClick={() => ref.current?.select()} ref={ref} value={value} onChange={(e: any) => setValue(e.target.value)} className='w-28 h-8' />
    );
}

export default InputBar
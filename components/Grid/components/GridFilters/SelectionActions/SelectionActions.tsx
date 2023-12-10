import { formalizeText } from '@/lib/my';
import React from 'react'

type Props = {
    selectionProps: selectionProps
}

type selectionProps = {
    addToSelection: (id: string) => void;
    removeFromSelection: (id: string) => void;
    isInSelection: (id: string) => boolean;
    clearSelection: () => void;
    mode: Mode;
}

type Mode = 'normal' | 'selection'

const SelectionActions = (props: Props) => {
    const { clearSelection, mode } = props.selectionProps
    return (
        <div className='flex flex-col justify-center items-center'>
            <div className='font-semibold tracking-wide text-xs -ml-2 my-2'>
                Interaction mode: {formalizeText(mode)}
            </div>
            <div className='flex gap-1 items-center justify-between'>
                <button onClick={clearSelection} className='px-1 border rounded bg-slate-100 hover:bg-slate-50 drop-shadow-sm'>Clear Selection</button>
            </div>
        </div>
    )
}

export default SelectionActions

'use client'
import { Upload } from 'lucide-react'
import React, { useRef } from 'react'
import { v4 } from 'uuid'

type Props = {
    setImageUrl: any
}

const UploadImageButton = (props: Props) => {
    const inputRef = useRef<HTMLInputElement>(null)

    function onUploadButtonClick() {
        inputRef.current?.click()
    }

    const changeImage = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0]
        if (file) {
            const reader = new FileReader()
            reader.onload = (e) => {
                props.setImageUrl(e.target?.result, file)
            }
            reader.readAsDataURL(file)
        }
    }


    return (
        <div onClick={() => onUploadButtonClick()} className='text-sm w-32 bg-slate-100 active:bg-green-50 cursor-pointer hover:bg-slate-100/30 p-2 rounded drop-shadow-sm border'>
            <div className='flex gap-1 items-center'>
                <Upload className='w-4 h-4' />
                <h1>Select Image</h1>
            </div>
            <input key={v4()} onChange={changeImage} ref={inputRef} type='file' accept='image/*' className='hidden' />
        </div>
    )
}

export default UploadImageButton
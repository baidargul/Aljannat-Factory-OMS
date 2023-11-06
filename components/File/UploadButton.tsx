'use client'
import { useState } from 'react';
import React from 'react'
import { S3 } from 'aws-sdk';
import axios from 'axios';
import { useRouter } from 'next/navigation';

const s3 = new S3({
    // Add your AWS configuration here
    // For example:
    accessKeyId: 'AKIATIQPEIGEHWZIEOP3',
    secretAccessKey: 'dk0yl2zEIstpeXAPx9QW55Ui1',
    region: 'ap-south-1', // e.g., 'us-west-2'
});

type Props = {
}

const UploadButton = (props: Props) => {
    const [file, setFile] = useState<any>(null)
    const [isUploading, setIsUploading] = useState<boolean>(false)
    const [isUploaded, setIsUploaded] = useState<boolean>(false)
    const router = useRouter()

    const handleFileUpload = (e: any) => {
        e.preventDefault()
        setFile(e.target.files[0])
    }

    const handleUploadClick = async (e: any) => {
        e.preventDefault();
        if (!file) return;

        try {
            setIsUploading(true)
            const data = new FormData();
            data.set('file', file);

            await axios.post('/api/file/upload/', data).then(res => {
                if (res.data.status === 200) {
                    console.log(`Uploaded successfully`)
                    setIsUploaded(true)
                    const redirectTo = res.data.data.redirectTo
                    router.push(redirectTo)
                }
            }).catch(error => {
                console.error('Error uploading the file:', error.response.data.message);
            });

        } catch (error) {
            console.log(error)
        }
        setIsUploading(false)
    };

    return (
        <div className='select-none'>
            <div className='p-2 flex gap-2 items-center border drop-shadow-sm w-fit rounded-sm'>
                <input disabled={isUploading} type="file" placeholder="Enter your name" accept='.xlsx, .xls' onChange={handleFileUpload}></input>
                <div className='flex gap-2 items-center'>
                    <button disabled={isUploading} onClick={handleUploadClick} className='p-2 border rounded-md w-fit text-xs'>
                        {
                            isUploading ? 'Uploading...' : 'Upload'}
                    </button>
                </div>
            </div>
            {isUploaded && (<div className={`text-xs my-2 text-center border-b-2 rounded-lg p-2 transition-all translate`}>
                Please wait now you're being redirected to the file processing page.
            </div>)}
        </div>
    )
}

export default UploadButton
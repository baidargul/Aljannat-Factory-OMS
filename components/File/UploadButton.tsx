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

export const tableHeaders = [
    "Status", "Description", "Tracking#", "Name", "Phone", "City", "Address", "Product"
]

const UploadButton = (props: Props) => {
    const [file, setFile] = useState<any>(null)
    const [isUploading, setIsUploading] = useState<boolean>(false)
    const router = useRouter()

    const handleFileUpload = (e: any) => {
        e.preventDefault()
        setFile(e.target.files[0])
    }

    const handleUploadClick = async (e: any) => {
        e.preventDefault();
        if (!file) return;
        const reader = new FileReader();
        reader.onload = async () => {
            if (typeof reader.result === 'string') {
                const base64Content = reader.result.split(',')[1]; // Extract only the base64 content

                // Send the Base64 encoded data to the API
                setIsUploading(true)
                console.log(`Path`, file)
                await axios.post('/api/file/upload/', { data: base64Content, fileName: file.name })
                    .then(response => {
                        if (response.status === 200) {
                            const redirectTo = response.data.data.redirectTo
                            router.push(redirectTo)
                        }
                        console.log('File uploaded successfully:', response.data);
                    })
                    .catch(error => {
                        console.error('Error uploading the file:', error.response.data.message);
                    });
                setIsUploading(false)
            } else {
                console.error('Failed to read the file content.');
            }
        };

        reader.readAsDataURL(file);
    };

    return (
        <>
            <div className='p-2 flex gap-2 items-center border drop-shadow-sm w-fit rounded-sm'>
                <input disabled={isUploading} type="file" placeholder="Enter your name" accept='.xlsx, .xls' onChange={handleFileUpload}></input>
                <div className='flex gap-2 items-center'>
                    <button disabled={isUploading} onClick={handleUploadClick} className='p-2 border rounded-md w-fit text-xs'>
                        {
                            isUploading ? 'Uploading...' : 'Upload'}
                    </button>
                </div>
            </div>
        </>
    )
}

export default UploadButton
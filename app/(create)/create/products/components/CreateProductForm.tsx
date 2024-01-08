'use client'
import { Input } from '@/components/ui/input'
import axios from 'axios'
import { useRouter } from 'next/navigation'
import React, { useState } from 'react'
import { toast } from 'sonner'
import UploadImageButton from './subComponents/CreateProductForm/UploadImageButton'
import Image from 'next/image'

type Props = {}

const CreateProductForm = (props: Props) => {
    const [productName, setProductName] = useState('')
    const [fileName, setFileName] = useState('' as any)
    const [imageUrl, setImageUrl] = useState('/none')
    const [isDoing, setIsDoing] = useState(false)
    const router = useRouter()

    async function createProduct() {
        setIsDoing(true)
        try {
            if (!productName) {
                toast.error('Please enter a product name', { duration: 3000 })
                setIsDoing(false)
                return
            }
            // if (imageUrl === '/none' || !imageUrl) {
            //     toast.error('Please select an image', { duration: 3000 })
            //     setIsDoing(false)
            //     return
            // }

            const data = {
                name: productName,
                image: imageUrl,
                fileName: fileName
            }
            await axios.post(`/api/product/create/`, data).then(async (res) => {
                const data = res.data
                if (data.status === 200) {
                    toast.success(data.message)
                    setProductName('')
                    setFileName('')
                    setImageUrl('/none')
                    router.refresh()
                } else {
                    toast.error(data.message)
                }
            }).catch((err) => {
                console.log(err)
            }).then(() => {
                setIsDoing(false)
            })


        } catch (error: any) {
            toast.error(error.message)
        }
        setProductName('')
        setImageUrl('/none')
        setIsDoing(false)
    }

    const clearImage = () => {
        setImageUrl('/none')
        setProductName('')
    }

    function setImage(imageEncoded: any, file: any) {
        setImageUrl(imageEncoded)
        setProductName(removeFileExtension(file.name))
        setFileName(file.name)
    }

    return (
        <section className='w-fit flex flex-col gap-2'>

            {/* <div className={`relative flex justify-center items-center p-2 ${imageUrl !== '/none' ? "bg-gradient-to-b from-orange-50 to-amber-100" : "bg-gradient-to-b from-zinc-100 to-slate-300"}  border-slate-300 border drop-shadow-sm rounded-md`}>
                {
                    imageUrl !== '/none' && (
                        <button onClick={clearImage} className='bg-gradient-to-r from-red-500 to-orange-500 hover:tracking-wide active:tracking-tighter transition-all z-10 right-2 top-2 absolute text-white rounded-full w-fit px-3 p-1 scale-75'>
                            -
                        </button>
                    )
                }
                <div className='p-2'>
                    <Image key={imageUrl} src={imageUrl !== '/none' ? imageUrl : "/Placeholders/question.png"} width={800} height={800} className={`w-36 h-36 rounded border border-white drop-shadow-lg ${!imageUrl && "hidden"}`} alt='image' />
                </div>
            </div> */}
            
            <div>
                <div className='font-semibold'>
                    Enter product name:
                </div>
                <div>
                    <Input disabled={isDoing} placeholder='New Product Name' className='h-10' value={productName} onChange={(e: any) => { setProductName(e.target.value) }} />
                </div>
            </div>
            <div className='flex gap-2'>
                {/* <div>
                    <UploadImageButton setImageUrl={setImage} />
                </div> */}
                <div>
                    <button disabled={isDoing} onClick={() => createProduct()} className={`text-sm w-32 bg-slate-100 active:bg-green-50 hover:bg-slate-100/30 p-2 rounded drop-shadow-sm border transition-all ${isDoing && "bg-gradient-to-r from-teal-400 to-yellow-200 cursor-not-allowed text-red-500"}`}>{isDoing ? "Please wait..." : "Add Product"}</button>
                </div>
            </div>
        </section>
    )
}

export default CreateProductForm

function removeFileExtension(filename: string) {
    return filename.split('.').slice(0, -1).join('.')
}
'use client'
import { Input } from '@/components/ui/input'
import axios from 'axios'
import { useRouter } from 'next/navigation'
import React, { useState } from 'react'
import { toast } from 'sonner'
import UploadImageButton from './subComponents/CreateProductForm/UploadImageButton'
import Image from 'next/image'

type Props = {
    selectedProduct: any
    setSelectedProduct: any
}

const CreateVariationForm = (props: Props) => {
    const [variantName, setVariantName] = useState('')
    const [weight, setWeight] = useState(0)
    const [price, setPrice] = useState(0)
    const [unit, setUnit] = useState('')
    const [fileName, setFileName] = useState('' as any)
    const [imageUrl, setImageUrl] = useState('/none')
    const [isDoing, setIsDoing] = useState(false)
    const router = useRouter()

    async function createVariant() {
        setIsDoing(true)
        try {
            if (!variantName) {
                toast.error('Please enter a variant name', { duration: 3000 })
                setIsDoing(false)
                return
            }
            if (imageUrl === '/none' || !imageUrl) {
                toast.error('Please select an image', { duration: 3000 })
                setIsDoing(false)
                return
            }
            if (weight < 0 || !weight) {
                toast.error('Please specify a valid weight', { duration: 3000 })
                setIsDoing(false)
                return
            }

            let amount = 0
            if (!price) {
                setPrice(0)
            } else {
                amount = price
            }

            if (!unit) {
                toast.error('Please specify a unit', { duration: 3000 })
                setIsDoing(false)
                return
            }

            if (!props.selectedProduct) {
                toast.error('Please specify a product first', { duration: 3000 })
                setIsDoing(false)
                return
            }

            const data = {
                productId: props.selectedProduct,
                name: variantName,
                weight: weight,
                price: amount,
                unit: unit,
                image: imageUrl,
                fileName: fileName
            }
            await axios.post(`/api/product/variations/create`, data).then(async (res) => {
                const data = await res.data
                if (data.status === 200) {
                    toast.success(data.message)
                    setVariantName('')
                    setFileName('')
                    setImageUrl('/none')
                    setWeight(0)
                    setPrice(0)
                    setUnit('')
                    console.log(data.data)
                    props.setSelectedProduct(data.data)
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
        setVariantName('')
        setImageUrl('/none')
        setIsDoing(false)
    }

    const clearImage = () => {
        setImageUrl('/none')
        setVariantName('')
    }

    function setImage(imageEncoded: any, file: any) {
        setImageUrl(imageEncoded)
        setVariantName(removeFileExtension(file.name))
        setFileName(file.name)
    }

    return (
        <section className='w-fit flex flex-col gap-2'>

            <div className={`relative flex justify-center items-center p-2 ${imageUrl !== '/none' ? "bg-gradient-to-b from-orange-50 to-amber-100" : "bg-gradient-to-b from-zinc-100 to-slate-300"}  border-slate-300 border drop-shadow-sm rounded-md`}>
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
            </div>

            <div>
                <div className='font-semibold'>
                    Enter variant name:
                </div>
                <div>
                    <Input placeholder='New Product Name' className='h-10' value={variantName} onChange={(e: any) => { setVariantName(e.target.value) }} />
                </div>
            </div>
            <div>
                <div className='font-semibold'>
                    Default weight
                </div>
                <div>
                    <Input placeholder='0.5' type='number' className='h-10' value={weight} onChange={(e: any) => { setWeight(e.target.value) }} />
                </div>
            </div>
            <div>
                <div className='font-semibold'>
                    Default price
                </div>
                <div>
                    <Input placeholder='1500' type='number' className='h-10' value={price} onChange={(e: any) => { setPrice(e.target.value) }} />
                </div>
            </div>
            <div>
                <div className='font-semibold'>
                    Unit
                </div>
                <div>
                    <Input placeholder='kg' className='h-10' value={unit} onChange={(e: any) => { setUnit(e.target.value) }} />
                </div>
            </div>
            <div className='flex gap-2'>
                <div>
                    <UploadImageButton setImageUrl={setImage} />
                </div>
                <div>
                    <button onClick={() => createVariant()} className={`text-sm w-32 bg-slate-100 active:bg-green-50 hover:bg-slate-100/30 p-2 rounded drop-shadow-sm border transition-all ${isDoing && "bg-gradient-to-r from-teal-400 to-yellow-200 cursor-not-allowed text-red-500"}`}>{isDoing ? "Please wait..." : "Create Variant"}</button>
                </div>
            </div>
        </section>
    )
}

export default CreateVariationForm

function removeFileExtension(filename: string) {
    return filename.split('.').slice(0, -1).join('.')
}
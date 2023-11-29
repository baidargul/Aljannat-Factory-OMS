'use client'
import React, { useEffect, useState } from 'react'
import { usePOS } from '@/hooks/usePOS'
import POSItemsHolder from './POSHolder/POSItemsHolder'
import POSOrderRowHolder from './POSHolder/POSOrderRowHolder'
import { Input } from '@/components/ui/input'
import { DatePicker } from '@/components/DatePicker/DatePicker'
import axios from 'axios'
import { Loader } from 'lucide-react'
import Image from 'next/image'
import { useClerk } from '@clerk/nextjs'
import { useRouter } from 'next/navigation'
import { toast } from 'sonner'

type Props = {
    products: any
    currentUser: any
}

type productSpecifications = {
    id: string,
    weight: number,
    amount: number
}

const POSHolder = (props: Props) => {
    const [selectedProduct, setSelectedProduct] = useState<any>(null)
    const [totalAmount, setTotalAmount] = useState<number>(0)
    const [customer, setCustomer] = useState<any>(null)
    const [isLoading, setIsLoading] = useState<boolean>(false)
    const [currentUser, setCurrentUser] = useState<any>(props.currentUser)
    const [dateOfBooking, setDateOfBooking] = useState<Date>(new Date())
    const [dateOfDelivery, setDateOfDelivery] = useState<Date>(new Date())
    const POS: any = usePOS()
    const { signOut } = useClerk()
    const router = useRouter()

    useEffect(() => {
        console.log(currentUser)
    }, [currentUser])


    useEffect(() => {
        POS.customer = customer
    }, [customer, POS])

    function handleNewOrder() {
        setIsLoading(true)
        setCustomer(null)
        setSelectedProduct(null)
        POS.products = []
        POS.customer = null
        setIsLoading(false)
    }

    async function handleSearch(phone: string) {
        setIsLoading(true)
        if (phone === "00000000001") {
            return
        }

        try {
            const res = await axios.get("../api/customer/find/phone/" + phone).then(async (res: any) => {
                const response = res.data
                if (response.status == 404) {
                    toast.error(res.data.message)
                    return
                }
                if (response.status == 200) {
                    setCustomer(response.data)
                    toast.success(response.message)
                    setCustomer(response?.data)
                } else {
                    setCustomer(null)
                    setCustomer(null)
                }
            }).catch((err: any) => {
                toast.error(err)
            })

        } catch (error: any) {
            toast.error(error)
        }

        setIsLoading(false)
    }

    const handleLogout = () => {
        signOut()
        router.push('/')
    }

    const handleSaveOrder = async () => {
        const data = {
            customer: { ...customer },
            products: [...POS.products],
            userId: currentUser.userId,
        }

        if (POS.products.length < 1) {
            toast.error(`No products selected`)
            return
        }

        if (!customer) {
            toast.error(`Please enter customer information`)
            return
        }

        if (!customer.name) {
            toast.error(`Please enter customer name`)
            return
        }

        if (!customer.phone) {
            toast.error(`Please enter customer first phone number`)
            return
        }

        if (!customer.city) {
            toast.error(`Please enter delivery city`)
            return
        }

        if (!customer.address) {
            toast.error(`Please enter delivery address`)
            return
        }

        setIsLoading(true)
        const res = await axios.post("/api/order/create", data).then((res: any) => {
            if (res.status == 200) {
                toast.success(res.data.message)
                handleNewOrder()
            } else {
                toast.error(res.data.message)
            }
        })
        setIsLoading(false)
    }

    function setDate(date: Date) {
        setDateOfBooking(date)
        setDateOfDelivery(date)
    }

    return (
        <>
            {isLoading && (
                <label className='absolute z-50 text-black left-[45%] top-[45%]'>
                    <div className='p-2 flex justify-center items-center gap-2 bg-red-800 text-white rounded-md'>
                        <Loader className='animate-spin' />
                        <p>
                            Please wait...
                        </p>
                    </div>
                </label>)
            }
            <div className={`${isLoading && "bg-red-500/40 blur-lg"}`}>
                <div className='flex gap-2 p-4 justify-between bg-slate-200 items-center drop-shadow-md'>
                    <div className='opacity-80 border p-2 rounded-md h-24 flex gap-2 -mt-4'>
                        <div className=''>
                            <DatePicker defaultValue={dateOfBooking} setValue={setDate} >
                                <section>
                                    <p className='font-semibold text-sm tracking-wider'>Booking:</p>
                                    <button className='text-xs text-start '>
                                        {new Date(dateOfBooking).toDateString()}
                                    </button>
                                </section>
                            </DatePicker>
                            <div onClick={() => setDateOfBooking(new Date())} className='text-center mt-2 text-xs font-semibold border-b-2 border border-slate-300 hover:bg-yellow-100 transition-all drop-shadow-sm hover:tracking-tight p-1 cursor-pointer rounded-md h-fit'>TODAY</div>
                        </div>
                        <div className=''>
                            <DatePicker defaultValue={dateOfDelivery} setValue={setDateOfDelivery} >
                                <section>
                                    <p className='font-semibold text-sm tracking-wider'>Delivery:</p>
                                    <button className='text-xs text-start '>
                                        {new Date(dateOfDelivery).toDateString()}
                                    </button>
                                </section>
                            </DatePicker>
                            <div onClick={() => setDateOfDelivery(new Date())} className='text-center mt-2 text-xs font-semibold border-b-2 border border-slate-300 hover:bg-yellow-100 transition-all drop-shadow-sm hover:tracking-tight p-1 cursor-pointer rounded-md h-fit'>TODAY</div>
                        </div>
                    </div>
                    <div>
                        {/* <HoverCardProvider content={<CustomerInput setCustomer={setCustomer} />}> */}
                        <div className='flex flex-col'>
                            <p className='font-semibold text-sm tracking-wider'>Name:</p>
                            <Input autoComplete='off' disabled={isLoading} name='customername' placeholder='Customer' className='text-black' value={customer ? customer?.name : ""} onChange={(e: any) => {
                                setCustomer({ ...customer, name: e.target.value })
                            }} />
                        </div>
                        {/* </HoverCardProvider> */}
                        <div className='flex gap-2'>
                            <div className='flex flex-col'>
                                <p className='font-semibold text-sm tracking-wider'>Phone 01:</p>
                                <Input autoComplete='off' disabled={isLoading} name='customerphone01' placeholder='Phone01' type='number' className='text-black' value={customer ? customer?.phone : ""} onChange={(e: any) => { setCustomer({ ...customer, phone: e.target.value }) }} maxLength={11} onKeyDown={async (e: any) => e.key === "Enter" ? await handleSearch(customer?.phone) : null} />
                            </div>
                            <div className='flex flex-col'>
                                <p className='font-semibold text-sm tracking-wider'>Phone 02:</p>
                                <Input autoComplete='off' disabled={isLoading} name='customerphone02' placeholder='Phone02' type='number' className='text-black' value={customer ? customer?.phone2 : ""} onChange={(e: any) => { setCustomer({ ...customer, phone2: e.target.value }) }} maxLength={11} onKeyDown={async (e: any) => e.key === "Enter" ? await handleSearch(customer?.phone2) : null} />
                            </div>
                            <div className='flex flex-col'>
                                <p className='font-semibold text-sm tracking-wider'>City:</p>
                                <Input autoComplete='off' disabled={isLoading} name='customercity' placeholder='City' className='text-black' value={customer ? customer?.city : ""} onChange={(e: any) => { setCustomer({ ...customer, city: e.target.value }) }} />
                            </div>
                            <div className='flex flex-col'>
                                <p className='font-semibold text-sm tracking-wider'>Address:</p>
                                <Input autoComplete='off' disabled={isLoading} name='customeraddress' placeholder='Address' className='text-black' value={customer ? customer?.address : ""} onChange={(e: any) => { setCustomer({ ...customer, address: e.target.value }) }} />
                            </div>
                        </div>
                    </div>
                    <div className='flex flex-col items-center'>
                        <div className='grid grid-cols-2 gap-2 rounded-md p-1 w-56 h-24 place-items-center justify-items-center'>
                            <button onClick={() => handleNewOrder()} className='border border-slate-300 hover:bg-yellow-100 transition-all drop-shadow-sm hover:tracking-tight p-2 rounded-md h-fit'>
                                New order
                            </button>
                            <button onClick={handleSaveOrder} className='border border-slate-300 hover:bg-yellow-100 transition-all drop-shadow-sm hover:tracking-tight p-2 rounded-md h-fit'>
                                Save order
                            </button>
                        </div>
                        <div className='-mt-5 text-xs font-semibold tracking-wider flex gap-2 items-center bg-zinc-100 rounded-t-md border-b border-slate-300 w-full justify-center px-2'>
                            <div className='bg-green-500 w-2 h-2 rounded-full animate-pulse'>

                            </div>
                            <p>
                                {currentUser.name}
                            </p>
                            <p className='font-normal leading-tight tracking-tight opacity-25'>
                                - {currentUser.role}
                            </p>
                        </div>
                    </div>

                </div>
                <div className="flex gap-2 min-h-screen mt-2 drop-shadow-md">
                    <div className={`w-[40%] text-ellipsis overflow-hidden whitespace-nowrap p-2 bg-slate-200`}>
                        <POSItemsHolder products={props.products} selectedProduct={selectedProduct} setSelectedProduct={setSelectedProduct} />
                        <div className='py-4 px-1 w-full flex gap-2 items-center bg-slate-50'>
                            <Image src={currentUser.imageURL} alt='loggedInUser' width={65} height={65} className='rounded-md' />
                            <section>
                                <h1>
                                    {
                                        currentUser && currentUser.name
                                    }
                                </h1>
                                <p className='text-xs'>
                                    {currentUser && currentUser.role}
                                </p>
                                <div>
                                    <button onClick={handleLogout} className='text-xs text-red-800 border-b border-red-800/40 p-0'>
                                        Logout
                                    </button>
                                </div>
                            </section>
                        </div>
                    </div>
                    <div className='w-[60%] text-ellipsis overflow-hidden whitespace-nowrap px-2 bg-slate-200'>
                        <POSOrderRowHolder />
                    </div>
                </div>
            </div>
        </>
    )
}

export default POSHolder
import { Loader } from 'lucide-react'
import prisma from '@/lib/prisma'
import React from 'react'
import * as XLSX from 'xlsx';
import { v4 } from 'uuid';
import { redirect } from 'next/navigation'
type Props = {
    params: any
    req: any
}

async function page(props: Props, context: any) {

    const { id } = props.params

    const processFile = await prisma.sheets.findUnique({
        where: {
            id: id
        }
    })

    let isComplete = false
    if (processFile) {
        try {
            const fileContentBuffer = Buffer.from(processFile.content, 'base64');

            const workbook = XLSX.read(fileContentBuffer, { type: 'buffer' });
            const sheetName = workbook.SheetNames[0];
            const worksheet = workbook.Sheets[sheetName];
            const fileData = XLSX.utils.sheet_to_json(worksheet, { header: 1 });
            const tableHeaders: any = fileData[0]
            const data = fileData

            data.map(async (row: any, index: number) => {
                if (index === 0) return
                let rowObject: any = {
                    id: v4(),
                }
                const fetchedCustomer = await getCustomer(row, tableHeaders)
                row.map((cell: any, index: number) => {
                    if (tableHeaders[index] === "Booking") {
                        rowObject = {
                            ...rowObject,
                            [tableHeaders[index]]: excelSerialToDate(cell)
                        }
                        return
                    }
                    rowObject = {
                        ...rowObject,
                        [tableHeaders[index]]: cell
                    }
                })
                await prisma.orders.create({
                    data: {
                        id: rowObject.id,
                        dateOfBooking: rowObject.Booking,
                        status: rowObject.Status,
                        note: rowObject.Note,
                        confirmedBy: rowObject.Confirmed,
                        product: rowObject.Product,
                        variant: rowObject.Variant,
                        weight: rowObject.Weight,
                        amount: rowObject.Amount,
                        courier: rowObject.Courier,
                        trackingNo: String(rowObject.Tracking),
                        customerId: fetchedCustomer.id
                    }
                })
            })

            await prisma.sheets.delete({
                where: {
                    id: id
                }
            })

            isComplete = true

        } catch (error) {
            console.error('Error processing the file:', error);
            redirectToErrorPage()
        }
    }

    if (!processFile) {
        redirectToErrorPage()
    }


    if(isComplete) {
        redirectToCompletePage()
    }

    function redirectToCompletePage() {
        redirect('/file/process/complete')
    }

    function redirectToErrorPage() {
        redirect('/file/process/error')
    }

    return (
        <div className='w-full min-h-screen bg-slate-100 flex justify-center items-center cursor-default select-none'>
            <div className='flex gap-2 items-center'>
                <p>
                    <Loader size={18} className='animate-spin' />
                </p>
                <p className='font-semibold'>
                    Processing data to database...
                </p>
                <p className='p-2 border-slate-300 border bg-slate-200 rounded-md '>
                    {processFile ? processFile?.name : "Invalid File"}
                </p>
            </div>
        </div>
    )
}

export default page

function excelSerialToDate(serial: any) {
    const millisecondsInDay = 24 * 60 * 60 * 1000; // 1 day in milliseconds
    const date = new Date(Date.UTC(1899, 11, 30)); // Excel's starting date is one day ahead (December 30, 1899)

    date.setUTCDate(date.getUTCDate() + serial);
    return date;
}

function toLocalDateAndTimeFormat(date: any, time: boolean = false, systemFormat: boolean = false) {
    if (systemFormat) {
        return date
    }
    const localDate = new Date(date);
    if (time) {
        return localDate.toLocaleDateString() + ' ' + localDate.toLocaleTimeString();
    }
    return localDate.toLocaleDateString();
}

async function getCustomer(row: any, tableHeaders: any) {
    let customer: any = {}
    row.map((cell: any, index: number) => {
        if (tableHeaders[index] === "Customer") {
            customer.name = cell
        }
        if (tableHeaders[index] === "Phone") {
            customer.phone = cell
        }
        if (tableHeaders[index] === "City") {
            customer.city = cell
        }
        if (tableHeaders[index] === "Address") {
            customer.address = cell
        }
    })

    console.log(`target phone: `, customer.phone)
    const fetchedCustomer = await prisma.customers.findFirst({
        where: {
            phone: customer.phone
        }
    })

    if (fetchedCustomer) {
        return fetchedCustomer
    }

    const createdCustomer = await prisma.customers.create({
        data: {
            id: v4(),
            name: customer.name,
            phone: customer.phone,
            city: customer.city,
            address: customer.address
        }
    })

    return createdCustomer
}
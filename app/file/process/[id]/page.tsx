import { Loader } from 'lucide-react'
import prisma from '@/lib/prisma'
import React from 'react'
import * as XLSX from 'xlsx';
import { v4 } from 'uuid';
import { redirect } from 'next/navigation'
import { Status, product, productVariations } from '@prisma/client';
// type Props = {
//     params: any,
//     req: any
// }

async function page(props: any, context: any) {

    // const { id } = props.params

    // const processFile = await prisma.sheets.findUnique({
    //     where: {
    //         id: id
    //     }
    // })


    // let isComplete = false
    // if (processFile) {
    //     try {
    //         const fileContentBuffer = Buffer.from(processFile.content, 'base64');

    //         const workbook = XLSX.read(fileContentBuffer, { type: 'buffer' });
    //         const sheetName = workbook.SheetNames[0];
    //         const worksheet = workbook.Sheets[sheetName];
    //         const fileData = XLSX.utils.sheet_to_json(worksheet, { header: 1 });
    //         const tableHeaders: any = fileData[0]
    //         const data = fileData

    //         let row: any

    //         let index = 0
    //         for (row of data) {
    //             try {
    //                 await createLog(`Processing index: ${index}`)
    //                 if (index > 0) {
    //                     let rowObject: any = {
    //                         id: v4(),
    //                     }

    //                     const fetchedCustomer = await getCustomer(row, tableHeaders);
    //                     if (fetchedCustomer) {
    //                         row.map((cell: any, iindex: number) => {
    //                             if (tableHeaders[iindex] === "Booking") {
    //                                 rowObject = {
    //                                     ...rowObject,
    //                                     [tableHeaders[iindex]]: excelSerialToDate(cell)
    //                                 }
    //                                 return
    //                             }
    //                             rowObject = {
    //                                 ...rowObject,
    //                                 [tableHeaders[iindex]]: cell
    //                             }
    //                         })
    //                         console.log(rowObject)

    //                         if (!rowObject.Booking) {
    //                             await createLog(`No date found on index: '${index}', skipping`)

    //                         } else {
    //                             if (!rowObject.Product) {
    //                                 await createLog(`No product found on index: '${index}', skipping`)

    //                             }
    //                             else {
    //                                 let product: product | null = await prisma.product.findFirst({
    //                                     where: {
    //                                         name: rowObject.Product.toLocaleLowerCase()
    //                                     }
    //                                 })

    //                                 if (!product) {
    //                                     await createLog(`Product not found creating...`)
    //                                     product = await prisma.product.create({
    //                                         data: {
    //                                             id: v4(),
    //                                             name: String(rowObject.Product).toLocaleLowerCase(),
    //                                         }
    //                                     })
    //                                     await createLog(`created: ${JSON.stringify(product)}`)
    //                                 } else {
    //                                     await createLog(`Product found`)
    //                                 }

    //                                 let variant: productVariations | null = await prisma.productVariations.findUnique({
    //                                     where: {
    //                                         name: rowObject.Variant.toLocaleLowerCase(),
    //                                         productId: product.id
    //                                     }
    //                                 })

    //                                 if (!variant) {
    //                                     await createLog(`'${rowObject.Variant}' variation not found in product ${product.name.toLocaleUpperCase()}, Adding it...`)
    //                                     variant = await prisma.productVariations.create({
    //                                         data: {
    //                                             id: v4(),
    //                                             productId: product.id,
    //                                             name: String(rowObject.Variant).toLocaleLowerCase(),
    //                                         }
    //                                     })
    //                                     await createLog(`created variation: ${JSON.stringify(variant)}`)
    //                                 } else {
    //                                     await createLog(`Variant found`)
    //                                 }

    //                                 await createLog(`Checking if order already exists with Tracking: ${rowObject.Tracking}`)
    //                                 const trackingAlreadyExists = await prisma.orders.findFirst({
    //                                     where: {
    //                                         trackingNo: String(rowObject.Tracking)
    //                                     }
    //                                 })


    //                                 if (!trackingAlreadyExists) {
    //                                     await createLog(`Creating new order ${rowObject.Tracking}`)
    //                                     const order = await prisma.orders.create({
    //                                         data: {
    //                                             id: String(rowObject.id),
    //                                             dateOfBooking: rowObject.Booking ? new Date(rowObject.Booking).toISOString() : "",
    //                                             status: Status.BOOKED,
    //                                             note: null,
    //                                             confirmedBy: rowObject.Confirmed ? String(rowObject.Confirmed) : "",
    //                                             product: product.id,
    //                                             variant: rowObject.Variant ? String(rowObject.Variant) : "",
    //                                             weight: rowObject.Weight ? String(rowObject.Weight) : "",
    //                                             amount: rowObject.Amount ? Number(rowObject.Amount) : 0,
    //                                             courier: rowObject.Courier ? String(rowObject.Courier) : "",
    //                                             trackingNo: rowObject.Tracking ? String(rowObject.Tracking) : "",
    //                                             customerId: String(fetchedCustomer.id),
    //                                         }
    //                                     })
    //                                     await prisma.ordersRegister.create({
    //                                         data: {
    //                                             id: v4(),
    //                                             orderId: rowObject.id,
    //                                             productId: product.id,
    //                                             variantId: variant.id,
    //                                             weight: rowObject.Weight ? Number(rowObject.Weight) : 0,
    //                                             amount: rowObject.Amount ? Number(rowObject.Amount) : 0,
    //                                         }
    //                                     })
    //                                 } else {
    //                                     await createLog(`Order with tracking no '${rowObject.Tracking}' already exists, altering it...`)
    //                                     await prisma.ordersRegister.create({
    //                                         data: {
    //                                             id: v4(),
    //                                             orderId: trackingAlreadyExists.id,
    //                                             productId: product.id,
    //                                             variantId: variant.id,
    //                                             weight: rowObject.Weight ? Number(rowObject.Weight) : 0,
    //                                             amount: rowObject.Amount ? Number(rowObject.Amount) : 0,
    //                                         }
    //                                     })

    //                                 }
    //                             }

    //                         }





    //                     } else {
    //                         await createLog(`Customer can't be fetched for: ${row}`)
    //                         console.log(`Customer can't be fetched for:`, row)
    //                     }
    //                 } else {
    //                     await createLog(`Skipping index: ${index}`)
    //                 }
    //                 index = index + 1
    //                 await createLog(`Processed index: ${index}`)
    //             } catch (error) {
    //                 await createLog(`Error on index: ${index}, ${error}`)
    //             }
    //         }


    //         // await Promise.all(data.map(async (row: any, index: number) => {
    //         //     if (index === 0) return
    //         //     let rowObject: any = {
    //         //         id: v4(),
    //         //     }

    //         //     const fetchedCustomer = await getCustomer(row, tableHeaders);
    //         //     if (fetchedCustomer) {
    //         //         row.map((cell: any, index: number) => {
    //         //             if (tableHeaders[index] === "Booking") {
    //         //                 rowObject = {
    //         //                     ...rowObject,
    //         //                     [tableHeaders[index]]: excelSerialToDate(cell)
    //         //                 }
    //         //                 return
    //         //             }
    //         //             rowObject = {
    //         //                 ...rowObject,
    //         //                 [tableHeaders[index]]: cell
    //         //             }
    //         //         })

    //         //         if (!rowObject.Booking) {
    //         //             // console.log(`No date found on index: '${index}', skipping`)
    //         //             return
    //         //         }

    //         //         let product: product | null = await prisma.product.findUnique({
    //         //             where: {
    //         //                 name: rowObject.Product
    //         //             }
    //         //         })

    //         //         console.log(product)

    //         //         if (!product) {
    //         //             console.log(`product not found creating...`)
    //         //             product = await prisma.product.create({
    //         //                 data: {
    //         //                     id: v4(),
    //         //                     name: String(rowObject.Product).toLocaleLowerCase(),
    //         //                 }
    //         //             })
    //         //             console.log(`created: `, product)
    //         //         }

    //         //         const order = await prisma.orders.create({
    //         //             data: {
    //         //                 id: String(rowObject.id),
    //         //                 dateOfBooking: rowObject.Booking ? new Date(rowObject.Booking).toISOString() : "",
    //         //                 status: rowObject.Status ? String(rowObject.Status) : "",
    //         //                 note: rowObject.Note ? String(rowObject.Note) : "",
    //         //                 confirmedBy: rowObject.Confirmed ? String(rowObject.Confirmed) : "",
    //         //                 product: product.id,
    //         //                 variant: rowObject.Variant ? String(rowObject.Variant) : "",
    //         //                 weight: rowObject.Weight ? String(rowObject.Weight) : "",
    //         //                 amount: rowObject.Amount ? Number(rowObject.Amount) : 0,
    //         //                 courier: rowObject.Courier ? String(rowObject.Courier) : "",
    //         //                 trackingNo: rowObject.Tracking ? String(rowObject.Tracking) : "",
    //         //                 customerId: String(fetchedCustomer.id),
    //         //             }
    //         //         })

    //         //     } else {
    //         //         console.log(`Customer can't be fetched for:`, row)
    //         //     }
    //         // }))

    //         await prisma.sheets.delete({
    //             where: {
    //                 id: id
    //             }
    //         })


    //         isComplete = true

    //     } catch (error) {
    //         console.error('Error processing the file:', error);
    //         redirectToErrorPage()
    //     }
    // }

    // if (!processFile) {
    //     redirectToErrorPage()
    // }


    // if (isComplete) {
    //     redirectToCompletePage()
    // }

    // function redirectToCompletePage() {
    //     redirect('/file/process/complete')
    // }

    // function redirectToErrorPage() {
    //     redirect('/file/process/error')
    // }

    // return (
    //     <div className='w-full min-h-screen bg-slate-100 flex justify-center items-center cursor-default select-none'>
    //         <div className='flex gap-2 items-center'>
    //             <p>
    //                 <Loader size={18} className='animate-spin' />
    //             </p>
    //             <p className='font-semibold'>
    //                 Processing data to database...
    //             </p>
    //             <p className='p-2 border-slate-300 border bg-slate-200 rounded-md '>
    //                 {processFile ? processFile?.name : "Invalid File"}
    //             </p>
    //         </div>
    //     </div>
    // )
}

export default page

// function excelSerialToDate(serial: any) {
//     const millisecondsInDay = 24 * 60 * 60 * 1000; // 1 day in milliseconds
//     const date = new Date(Date.UTC(1899, 11, 30)); // Excel's starting date is one day ahead (December 30, 1899)

//     date.setUTCDate(date.getUTCDate() + serial);
//     return date;
// }

// function toLocalDateAndTimeFormat(date: any, time: boolean = false, systemFormat: boolean = false) {
//     if (systemFormat) {
//         return date
//     }
//     const localDate = new Date(date);
//     if (time) {
//         return localDate.toLocaleDateString() + ' ' + localDate.toLocaleTimeString();
//     }
//     return localDate.toLocaleDateString();
// }

// async function getCustomer(row: any, tableHeaders: any) {

//     try {
//         let customer: any = {}
//         let hasDate = true;
//         row.map((cell: any, index: number) => {
//             if (tableHeaders[index] === "Booking") {
//                 if (!cell) {
//                     hasDate = false
//                 }
//             }
//             if (tableHeaders[index] === "Customer") {
//                 customer.name = cell
//             }
//             if (tableHeaders[index] === "Phone") {
//                 if (cell) {
//                     customer.phone = cell
//                 } else {
//                     customer.phone = "00000000001"
//                 }
//             }
//             if (tableHeaders[index] === "Phone2") {
//                 if (cell) {
//                     customer.phone2 = cell
//                 } else {
//                     customer.phone2 = "00000000001"
//                 }
//             }
//             if (tableHeaders[index] === "City") {
//                 customer.city = cell
//             }
//             if (tableHeaders[index] === "Address") {
//                 customer.address = cell
//             }
//         })

//         if (!hasDate) {
//             return null
//         }

//         const fetchedCustomer = await prisma.customers.findFirst({
//             where: {
//                 OR: [
//                     {
//                         phone: String(customer.phone),
//                     },
//                     {
//                         phone2: String(customer.phone2),
//                     },
//                 ]
//             }
//         })

//         if (fetchedCustomer) {
//             return fetchedCustomer
//         }

//         const createdCustomer = await prisma.customers.create({
//             data: {
//                 id: v4(),
//                 name: customer.name ? String(customer.name) : "Unknown",
//                 phone: customer.phone ? String(customer.phone) : "00000000001",
//                 phone2: customer.phone2 ? String(customer.phone2) : "00000000001",
//                 city: customer.city ? String(customer.city) : "Unknown",
//                 address: customer.address ? String(customer.address) : "Unknown",
//             }
//         })

//         return createdCustomer
//     } catch (error) {
//         console.log(`ERROR:`, error)
//     }

// }



// async function createLog(description: string) {
//     await prisma.errorlogs.create({
//         data: {
//             id: v4(),
//             description: description,
//         }
//     })
// }
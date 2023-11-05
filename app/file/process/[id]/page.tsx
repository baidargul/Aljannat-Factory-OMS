import { Loader } from 'lucide-react'
import prisma from '@/lib/prisma'
import React from 'react'
import fs from 'fs';
import path from 'path';
import * as XLSX from 'xlsx';
type Props = {
    params: any
}

const page = async (props: Props) => {

    const { id } = props.params

    const processFile = await prisma.sheets.findUnique({
        where: {
            id: id
        }
    })

    if (processFile) {
        try {
            const fileContentBuffer = Buffer.from(processFile.content, 'base64');

            const workbook = XLSX.read(fileContentBuffer, { type: 'buffer' });
            const sheetName = workbook.SheetNames[0];
            const worksheet = workbook.Sheets[sheetName];
            const fileData = XLSX.utils.sheet_to_json(worksheet, { header: 1 });
            const data = fileData
            // console.log(data)

            data.map((row: any, index: number) => {
                if(index===0) return
                row.map((cell: any, index: number) => {
                    console.log(`cell:`, cell)
                })
            })


        } catch (error) {
            console.error('Error processing the file:', error);
        }
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
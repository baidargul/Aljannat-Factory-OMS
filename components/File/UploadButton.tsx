'use client'
import { useState } from 'react';
import * as XLSX from 'xlsx';
import React from 'react'

type Props = {
    children: React.ReactNode
}

export const tableHeaders = [
    "Status", "Description", "Tracking#", "Name", "Phone", "City", "Address", "Product"
]

const UploadButton = (props: Props) => {
    const [data, setData] = useState<any>(null);
    const [availableSheets, setAvailableSheets] = useState<string[]>([]);
    const [isReadingFile, setIsReadingFile] = useState<boolean>(false);
    const [selectedSheet, setSelectedSheet] = useState<string>("");
    // Remove the 'reader' state
    const [workbook, setWorkbook] = useState<any>(null);


    const handleFileUpload = (e: any) => {
        setIsReadingFile(true);
        const tempReader = new FileReader();
        tempReader.onload = (event: any) => {
            const data = event.target.result;
            const workbook = XLSX.read(data, { type: 'binary' });
            const sheets = workbook.SheetNames;
            setAvailableSheets(sheets);
            setWorkbook(workbook);
            setIsReadingFile(false);
        };

        tempReader.readAsBinaryString(e.target.files[0]);
    }

    const handleUploadClick = () => {
        setIsReadingFile(true);
        // Check if any sheets are available in the workbook
        if (workbook && workbook.SheetNames.length > 0) {
            if (!selectedSheet) {
                setSelectedSheet(workbook.SheetNames[0]); // Access the first sheet
            }
            const sheet = workbook.Sheets[selectedSheet];
            const parseData = XLSX.utils.sheet_to_json(sheet);
            setData(parseData);
            setIsReadingFile(false);
        } else {
            // Handle the case where there are no sheets in the workbook
            setIsReadingFile(false);
            console.error("No sheets found in the workbook.");
        }
    }

    return (
        <>
            <div className='p-2 flex gap-2 items-center border drop-shadow-sm w-fit rounded-sm'>
                <input type="file" placeholder="Enter your name" accept='.xlsx, .xls' onChange={handleFileUpload}></input>
                <div className='flex gap-2 items-center'>
                    <label className='text-xs'>
                        Sheet:
                    </label>
                    <select className='text-xs p-2 select:border-cyan-300 border rounded-md'>
                        {availableSheets && availableSheets.map((sheetName: string) => (
                            <option key={sheetName} value={sheetName}>{sheetName}</option>
                        ))}
                    </select>
                    <button onClick={handleUploadClick} className='p-2 border rounded-md w-fit text-xs'>
                        Upload
                    </button>
                </div>
            </div>
            {
                props.children
            }
        </>
    )
}

export default UploadButton
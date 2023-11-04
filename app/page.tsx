'use client'
import { useState } from 'react';
import * as XLSX from 'xlsx';

export default function Home() {
  const [data, setData] = useState<any>(null);
  const [availableSheets, setAvailableSheets] = useState<string[]>([]);
  const [isReadingFile, setIsReadingFile] = useState<boolean>(false);
  // Remove the 'reader' state
  const [workbook, setWorkbook] = useState<any>(null);
  const headers = [
    "Status", "Description", "Tracking#", "Name", "Phone", "City", "Address", "Product"
  ]

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
      const firstSheetName = workbook.SheetNames[0]; // Access the first sheet
      const sheet = workbook.Sheets[firstSheetName];
      const parseData = XLSX.utils.sheet_to_json(sheet);
      setData(parseData);
      setIsReadingFile(false);
    } else {
      // Handle the case where there are no sheets in the workbook
      setIsReadingFile(false);
      console.error("No sheets found in the workbook.");
    }
  }

  console.log(data)

  return (
    <div className={`flex flex-col gap-2 justify-center items-center p-4 ${isReadingFile && "cursor-wait"} cursor-default`}>
      <div className='p-2 flex gap-2 items-center border drop-shadow-sm w-fit rounded-sm'>
        <input type="file" placeholder="Enter your name" accept='.xlsx, .xls' onChange={handleFileUpload}></input>
        <div className='flex gap-2 items-center'>
          <label className='text-xs'>
            Sheet:
          </label>
          <select className='text-xs'>
            {availableSheets && availableSheets.map((sheetName: string) => (
              <option key={sheetName} value={sheetName}>{sheetName}</option>
            ))}
          </select>
          <button onClick={handleUploadClick} className='p-2 border rounded-md w-fit text-xs'>
            Upload
          </button>
        </div>
      </div>

      <div>
        <table className='w-full border-collapse'>
          <thead className='bg-gray-200'>
            <tr className='text-xs flex items-center border-b border-gray-300'>
              {headers.map((header: string, index: number) => (
                <th key={index} className='header-cell p-2 text-left w-44 text-ellipsis overflow-hidden '>
                  {header.toUpperCase()}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className=''>
            {data && data.map((row: any, index: number) => (
              <tr key={index} className={`text-xs flex items-center border-b border-gray-300 `}>
                {Object.keys(row).slice(1).map((key: any, index: number) => (
                  <td key={index} className={`data-cell p-2 w-44 text-ellipsis overflow-hidden whitespace-nowrap`}>
                    {
                    typeof (row[key]) === 'string' ? row[key].toUpperCase() : row[key]
                    }
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>


      </div>
    </div>
  );
}

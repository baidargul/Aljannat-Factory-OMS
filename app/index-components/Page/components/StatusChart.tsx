'use client'
import prisma from '@/lib/prisma'
import { Status } from '@prisma/client'
import React, { useEffect } from 'react'
import StatusPoint from './sub/StatusChart/StatusPoint'
import axios from 'axios'

type Props = {}

const StatusChart = (props: Props) => {
    const [data, setData] = React.useState<any>([])

    useEffect(() => {
        const interval = setInterval(() => {
            axios.get('/api/order/all/summary/').then(async (res) => {
                const response = await res.data;
                if (response.status === 200) {
                    setData(response.data);
                }
            });
        }, 5000);
    
        return () => {
            clearInterval(interval);
        };
    }, []); // Empty dependency array to run only once on mount


    return (
        <div>
            <div className='flex gap-2'>
                {
                    data.map((item: any, index: number) => {

                        return (
                            <div key={index}>
                                <StatusPoint item={item} />
                            </div>
                        )
                    })
                }
            </div>
        </div>
    )
}

export default StatusChart
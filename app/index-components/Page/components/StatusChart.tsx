'use client'
import React, { useEffect } from 'react'
import StatusPoint from './sub/StatusChart/StatusPoint'
import axios from 'axios'
import { toast } from 'sonner'

type Props = {}

const StatusChart = (props: Props) => {
    const [data, setData] = React.useState<any>([])

    const getData = async () => {
        await axios.get('/api/order/all/summary/').then(async (res) => {
            const response = await res.data;
            if (response.status === 200) {
                setData(response.data);
            }
        });
    }

    useEffect(() => {
        const interval = setInterval(() => {
            try {
                getData();
            } catch (error: any) {
                toast.error(error.message)
            }
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
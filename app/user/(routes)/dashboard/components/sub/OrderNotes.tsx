'use client'
import axios from 'axios'
import React, { useEffect, useState } from 'react'
import { toast } from 'sonner'

type Props = {}

const OrderNotes = (props: Props) => {
    const [orders, setOrders] = useState<any[]>([])

    useEffect(() => {
        const intervalId = setInterval(() => {
            getOrders();
        }, 5000);

        return () => {
            clearInterval(intervalId);
        };
    }, []);

    useEffect(() => {
        console.log(orders);
    }, [orders]);

    async function getOrders() {
        try {
            const res = await axios.get('/api/order/notes');
            const data = res.data;

            if (data.status === 200) {
                setOrders(data.data);
            } else {
                setOrders([]);
            }
        } catch (err: any) {
            toast.error(err.message);
        }
    }

    return (
        <div>
            {
                orders.map((order) => {

                    return (
                        <div className="flex flex-col border border-gray-200 rounded-lg shadow-md p-4 mb-4">
                            <div className="flex justify-between items-center">
                                <div className="flex items-center">
                                    <div className="flex flex-col">
                                        <span className="text-sm font-medium text-gray-700">{order.orderId}</span>
                                        <span className="text-xs font-medium text-gray-500">{order.customerName}</span>
                                    </div>
                                </div>
                                <div className="flex items-center">
                                    <span className="text-xs font-medium text-gray-500">{order.createdAt}</span>
                                </div>
                            </div>
                            <div className="flex flex-col">
                                <span className="text-sm font-medium text-gray-700">{order.notes}</span>
                            </div>
                        </div>
                    )

                })
            }
        </div>
    )
}

export default OrderNotes
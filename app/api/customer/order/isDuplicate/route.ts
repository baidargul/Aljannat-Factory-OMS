import prisma from '@/lib/prisma';
import { NextRequest } from 'next/server';

export async function POST(req: NextRequest) {

    const response = {
        status: 500,
        message: 'Internal Server Error',
        data: null as any
    }

    try {

        const { customerId, orderId } = await req.json()
        if (!customerId) {
            response.status = 400;
            response.message = 'Bad Request';
            response.data = null;
            return new Response(JSON.stringify(response));
        }

        const customer = await prisma.customers.findFirst({
            where: {
                id: customerId
            }
        })

        if (!customer) {
            response.status = 404;
            response.message = 'Customer not exists';
            response.data = null;
            return new Response(JSON.stringify(response));
        }

        const lastOrderFromThisCustomer = await prisma.orders.findFirst({
            include: {
                customers: true
            },
            where: {
                customerId: customer.id,
                NOT: {
                    id: orderId
                }
            },
            orderBy: {
                createdAt: 'desc'
            }
        })

        const order = await prisma.orders.findUnique({
            where: {
                id: orderId
            }
        })

        if (order) {
            //Check difference between last order and current order dates

            const lastOrderDate = new Date(lastOrderFromThisCustomer?.createdAt as Date);
            const currentOrderDate = new Date(order.createdAt as Date);

            const diffTime = Math.abs(currentOrderDate.getTime() - lastOrderDate.getTime());

            const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

            let minimumOrderDayThreshold: any = await prisma.settings.findUnique({
                where: {
                    name: "Order duplication threshold"
                }
            })
            minimumOrderDayThreshold = minimumOrderDayThreshold?.value1 || 2

            if (diffDays < minimumOrderDayThreshold) {
                response.status = 400;
                response.message = 'Might be duplicate order';
                response.data = true;
                return new Response(JSON.stringify(response));
            } else {
                response.status = 200;
                response.message = 'Not duplicate order';
                response.data = false;
                return new Response(JSON.stringify(response));
            }

        }

    } catch (error: any) {
        console.log('[SERVER ERROR]: ' + error.message);
        response.status = 500;
        response.message = error.message;
        response.data = null;
        return new Response(JSON.stringify(response));
    }

}
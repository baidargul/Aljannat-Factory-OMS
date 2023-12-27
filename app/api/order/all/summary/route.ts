import prisma from '@/lib/prisma';
import { Role, Status } from '@prisma/client';
import { NextRequest } from 'next/server';

export async function GET(req: NextRequest) {

    const response = {
        status: 500,
        message: 'Internal Server Error',
        data: null as any
    }

    try {

        const forOrderVerification = await prisma.orders.findMany({
            where: {
                status: Status.BOOKED
            }
        })

        const forpaymentVerification = await prisma.orders.findMany({
            where: {
                status: Status.VERIFIEDORDER
            }
        })

        const forDispatchDivision = await prisma.orders.findMany({
            where: {
                status: Status.PAYMENTVERIFIED
            }
        })

        const forInventoryDivision = await prisma.orders.findMany({
            where: {
                status: Status.READYTODISPATCH
            }
        })

        const handedOverToLogisitics = await prisma.orders.findMany({
            where: {
                status: Status.DISPATCHED
            }
        })

        const cancelled = await prisma.orders.findMany({
            where: {
                status: Status.CANCELLED
            }
        })

        const data = [{ order: forOrderVerification.length, name: "ORDER VERIFICATION" }, { order: forpaymentVerification.length, name: "PAYMENT VERIFICATION" }, { order: forDispatchDivision.length, name: "DISPATCH DIVISION" }, { order: forInventoryDivision.length, name: "INVENTORY DIVISION" }, {order:handedOverToLogisitics.length, name:"TOWARDS LOGISTICS"}, {order:cancelled.length, name:"CANCELLED ORDERS"}]

        response.status = 200;
        response.message = 'Success';
        response.data = data;
        return new Response(JSON.stringify(response));
    } catch (error: any) {
        console.log('[SERVER ERROR]: ' + error.message);
        response.status = 500;
        response.message = error.message;
        response.data = null;
        return new Response(JSON.stringify(response));
    }

}
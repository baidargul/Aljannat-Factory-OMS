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
        const forOrderVerificationInWork = await prisma.orders.findMany({
            where: {
                AND: {
                    status: Status.BOOKED,
                    NOT: {
                        userId: null
                    }
                }
            }
        })

        const forpaymentVerification = await prisma.orders.findMany({
            where: {
                status: Status.VERIFIEDORDER
            }
        })
        const forpaymentVerificationInWork = await prisma.orders.findMany({
            where: {
                AND: {
                    status: Status.VERIFIEDORDER,
                    NOT: {
                        userId: null
                    }
                }
            }
        })

        const forDispatchDivision = await prisma.orders.findMany({
            where: {
                status: Status.PAYMENTVERIFIED
            }
        })
        const forDispatchDivisionInWork = await prisma.orders.findMany({
            where: {
                AND: {
                    status: Status.PAYMENTVERIFIED,
                    NOT: {
                        userId: null
                    }
                }
            }
        })

        const forInventoryDivision = await prisma.orders.findMany({
            where: {
                status: Status.READYTODISPATCH
            }
        })
        const forInventoryDivisionInWork = await prisma.orders.findMany({
            where: {
                AND: {
                    status: Status.READYTODISPATCH,
                    NOT: {
                        userId: null
                    }
                }
            }
        })

        const handedOverToLogisitics = await prisma.orders.findMany({
            where: {
                status: Status.DISPATCHED
            }
        })
        const handedOverToLogisiticsInWork = await prisma.orders.findMany({
            where: {
                AND: {
                    status: Status.DISPATCHED,
                    NOT: {
                        userId: null
                    }
                }
            }
        })

        const cancelled = await prisma.orders.findMany({
            where: {
                status: Status.CANCELLED
            }
        })
        const cancelledInWork = await prisma.orders.findMany({
            where: {
                AND: {
                    status: Status.CANCELLED,
                    NOT: {
                        userId: null
                    }
                }
            }
        })

        const data = [{ order: forOrderVerification.length, name: "ORDER VERIFICATION", inWork: forOrderVerificationInWork.length }, { order: forpaymentVerification.length, name: "PAYMENT VERIFICATION", inWork: forpaymentVerificationInWork.length }, { order: forDispatchDivision.length, name: "DISPATCH DIVISION", inWork: forDispatchDivisionInWork.length }, { order: forInventoryDivision.length, name: "INVENTORY DIVISION", inWork: forInventoryDivisionInWork.length }, { order: handedOverToLogisitics.length, name: "TOWARDS LOGISTICS", inWork: handedOverToLogisiticsInWork.length }, { order: cancelled.length, name: "CANCELLED ORDERS", inWork: cancelledInWork.length }]

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
import prisma from "@/lib/prisma";
import { NextRequest } from "next/server";


type Res = {
    status: number,
    message: string,
    data: any
}
export async function POST(req: NextRequest) {

    const response: Res = {
        status: 500,
        message: 'Internal Server Error',
        data: {}
    }

    try {

        const requested = await req.json();
        const { userId } = requested;

        if (!userId) {
            response.status = 400;
            response.message = 'Bad Request, Required userId';
            return new Response(JSON.stringify(response));
        }

        const orders = await prisma.orders.findMany({
            include: {
                customers: true,
                profile: true,
                orderNotes: {
                    orderBy: {
                        createdAt: "desc",
                    }
                },
                ordersRegister: {
                    include: {
                        productVariations: {
                            select: {
                                name: true,
                                defaultUnit: true,
                            }
                        },
                        product: {
                            select: {
                                id: true,
                                name: true,
                            }
                        },
                    }
                },
            },
            orderBy: {
                dateOfBooking: "asc",
            },
            where: {
                userId: userId,
            }
        });

        response.status = 200;
        response.message = 'Orders are fetched for the user';
        response.data = orders;
        return new Response(JSON.stringify(response))
    } catch (error: any) {
        response.status = 500;
        response.message = error.message;
        response.data = error;
        return new Response(JSON.stringify(response))
    }

}
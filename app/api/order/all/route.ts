import prisma from "@/lib/prisma";
import { NextRequest } from "next/server";

type Res = {
    status: number;
    message: string;
    data: any;
}
export async function GET(req: NextRequest) {
    const response: Res = {
        status: 200,
        message: "Bad Request",
        data: null
    }

    try {

        const orders = await prisma.orders.findMany({
            include: {
                customers: {
                    include:{
                        logisticsCities: true,
                    }
                },
                profile: true,
                orderNotes: {
                    include:{
                        profile: true,  
                    },
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
            }
        });

        response.status = 200;
        response.message = "Success";
        response.data = orders;
        return new Response(JSON.stringify(response))
    } catch (error) {
        response.status = 500;
        response.message = "Internal Server Error";
        response.data = error;
        return new Response(JSON.stringify(response))
    }
}
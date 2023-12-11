import prisma from "@/lib/prisma";
import { Role, Status, profile } from "@prisma/client";
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

        const user = await prisma.profile.findUnique({
            where: {
                userId: userId,
            }
        })

        if (!user) {
            response.status = 404;
            response.message = 'Invalid user!';
            return new Response(JSON.stringify(response));
        }

        const targetStatus: Status = orderStatusforUser(user);

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
                status: targetStatus,
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

function orderStatusforUser(user: profile) {
    const role: Role = user.role;

    switch (role) {
        case Role.ORDERBOOKER:
            return Status.BOOKED;
        case Role.ORDERVERIFIER:
            return Status.BOOKED;
        case Role.PAYMENTVERIFIER:
            return Status.VERIFIEDORDER
        case Role.DISPATCHER:
            return Status.PAYMENTVERIFIED
        case Role.INVENTORYMANAGER:
            return Status.READYTODISPATCH
        default:
            return Status.BOOKED;
    }
}
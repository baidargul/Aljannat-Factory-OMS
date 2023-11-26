import prisma from "@/lib/prisma";
import { Status } from "@prisma/client";
import { NextRequest } from "next/server";
import { v4 } from "uuid";

export async function PATCH(req: NextRequest) {
    const response = {
        status: 400,
        message: "Bad Request",
        data: null as any
    }

    try {

        const data = await req.json()

        if (!data) {
            response.status = 400
            response.message = "No data submitted"
            response.data = null
            return new Response(JSON.stringify(response))
        }

        const { orderId, userId } = data
        const status: Status = data.status

        if (!orderId) {
            response.status = 400
            response.message = "Order ID is required"
            response.data = null
            return new Response(JSON.stringify(response))
        }

        if (!status) {
            response.status = 400
            response.message = "Status is required"
            response.data = null
            return new Response(JSON.stringify(response))
        }

        const order = await prisma.orders.findUnique({
            where: {
                id: orderId
            }
        })

        if (!order) {
            response.status = 400
            response.message = "Order not found in the database"
            response.data = null
            return new Response(JSON.stringify(response))
        }

        const profileUser = await prisma.profile.findUnique({
            where: {
                userId: userId
            }
        })

        if (!profileUser) {
            response.status = 400
            response.message = "User not found in the database"
            response.data = null
            return new Response(JSON.stringify(response))
        }

        const newOrder = await prisma.orders.update({
            where: {
                id: orderId
            },
            data: {
                status: status,
                userId: userId
            }
        })

        if (!newOrder) {
            response.status = 400
            response.message = "Error updating order"
            response.data = null
            return new Response(JSON.stringify(response))
        }

        const freshOrder = await prisma.orders.findUnique({
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
            where: {
                id: orderId
            }
        });



        response.status = 200
        response.message = "Success, updating status for order."
        response.data = freshOrder
        return new Response(JSON.stringify(response))
    } catch (error) {
        response.status = 500
        response.message = "Internal Server Error"
        response.data = null
        return new Response(JSON.stringify(response))
    }
}
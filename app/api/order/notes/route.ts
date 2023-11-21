import prisma from "@/lib/prisma";
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

        const { orderId, note, userId } = data

        if (!orderId) {
            response.status = 400
            response.message = "Order ID is required"
            response.data = null
            return new Response(JSON.stringify(response))
        }

        if (!note) {
            response.status = 400
            response.message = "Notes are required"
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

        const newNote = await prisma.orderNotes.create({
            data: {
                id: v4(),
                orderId: orderId,
                userId: userId,
                note: note
            }
        })

        if (!newNote) {
            response.status = 400
            response.message = "Error creating note"
            response.data = null
            return new Response(JSON.stringify(response))
        }

        const updatedOrder = await prisma.orders.update({
            where: {
                id: orderId
            },
            data: {
                noteId: newNote.id
            }
        })

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
        response.message = "Success, order note created"
        response.data = freshOrder

    } catch (error) {
        console.log(`[ORDER NOTES]-ERROR: `, error)
        response.status = 500
        response.message = "Internal Server Error"
        response.data = null
    }
    return new Response(JSON.stringify(response))
}
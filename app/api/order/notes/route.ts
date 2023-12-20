import prisma from "@/lib/prisma";
import { Role } from "@prisma/client";
import { NextRequest } from "next/server";
import { v4 } from "uuid";

export async function GET(req: NextRequest) {
    const response = {
        status: 400,
        message: "Bad Request",
        data: null as any
    }

    try {

        const orders = await prisma.orderNotes.findMany({
            take: 6,
            include: {
                profile: true,
            },
            orderBy: {
                createdAt: "desc",
            }
        })

        if (!orders) {
            response.status = 400
            response.message = "No orders found"
            response.data = null
            return new Response(JSON.stringify(response))
        }

        response.status = 200
        response.message = "Success"
        response.data = orders
        return new Response(JSON.stringify(response))
    } catch (error) {
        console.log(`[SERVER ERROR]: Order->Notes->GET: `, error)
        response.status = 500
        response.message = "Internal Server Error"
        response.data = null
        return new Response(JSON.stringify(response))
    }
}

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

        if (!userId) {
            response.status = 400
            response.message = "User ID is required"
            response.data = null
            return new Response(JSON.stringify(response))
        }

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

        const user = await prisma.profile.findUnique({
            where: {
                userId: userId
            }
        })

        if (!user) {
            response.status = 400
            response.message = "Session not verified, please login again."
            response.data = null
            return new Response(JSON.stringify(response))
        }


        // REJECTED CHECK FOR PREVIOUS ORDER USER AS PREVIOUS USER PASSES ORDER AND NULLED OUT FOR FURTHER PROCESSING BY OTHER USERS DOMAIN
        // const previousOrderUser = await prisma.orders.findUnique({
        //     where: {
        //         id: orderId
        //     },
        //     include: {
        //         profile: true
        //     }
        // })

        // if (!previousOrderUser) {
        //     response.status = 400
        //     response.message = "Order not found in the database"
        //     response.data = null
        //     return new Response(JSON.stringify(response))
        // }

        // if (previousOrderUser.profile) {
        //     if (previousOrderUser.profile.userId !== userId) {
        //         const previousRole = previousOrderUser.profile.role
        //         const currentRole = user.role

        //         const roleStatus = getRoleStatus(currentRole, previousRole)

        //         if (roleStatus === "down") {
        //             response.status = 400
        //             response.message = "Order has been processed and forwarded to the next department, you cannot edit this order"
        //             response.data = null
        //             return new Response(JSON.stringify(response))

        //         } else if (roleStatus === "up") {
        //             response.status = 400
        //             response.message = "Order is being processed by a higher department, you cannot edit this order"
        //             response.data = null
        //             return new Response(JSON.stringify(response))
        //         } else {
        //             // same
        //             response.status = 400
        //             response.message = "Order is under your department, but assigned to another user, you cannot edit this order"
        //             response.data = null
        //             return new Response(JSON.stringify(response))
        //         }

        //     }
        // } else {
        //     response.status = 400
        //     response.message = "No previous author found for this order, please contact support"
        //     response.data = null
        //     return new Response(JSON.stringify(response))
        // }

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
                noteId: newNote.id,
                userId: userId
            }
        })

        const freshOrder = await prisma.orders.findUnique({
            include: {
                customers: true,
                profile: true,
                orderNotes: {
                    include: {
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
            where: {
                id: orderId
            }
        });

        response.status = 200
        response.message = "Success, order updated"
        response.data = freshOrder

    } catch (error) {
        console.log(`[ORDER NOTES]-ERROR: `, error)
        response.status = 500
        response.message = "Internal Server Error"
        response.data = null
    }
    return new Response(JSON.stringify(response))
}

function getRoleStatus(currentRole: Role, previousRole: Role) {
    let reply = ""
    const ranks: any = {
        [Role.SUPERADMIN]: 1,
        [Role.ADMIN]: 2,
        [Role.MANAGER]: 3,
        [Role.ORDERBOOKER]: 4,
        [Role.ORDERVERIFIER]: 5,
        [Role.PAYMENTVERIFIER]: 6,
        [Role.DISPATCHER]: 7,
        [Role.UNVERIFIED]: 8,
    }

    const currentUserRank: Role = ranks[currentRole as Role];
    const previousUserRank: Role = ranks[previousRole as Role];

    if (currentUserRank < previousUserRank) {
        reply = "down"
    } else if (currentUserRank > previousUserRank) {
        reply = "up"
    } else {
        reply = "same"
    }
    return reply
}
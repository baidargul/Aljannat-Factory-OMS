import prisma from "@/lib/prisma";
import { NextRequest } from "next/server";

export async function POST(req: NextRequest) {

    const response = {
        status: 500,
        messaage: "Internal Server Error",
        data: null as any
    }

    try {

        const { userId } = await req.json()

        if (!userId) {
            response.status = 400
            response.messaage = "Bad Request"
            response.data = "userId is required"
            return new Response(JSON.stringify(response))
        }

        const isExists = await prisma.profile.findUnique({
            where: {
                id: userId
            }
        })

        if (!isExists) {
            response.status = 404
            response.messaage = "Not Found"
            response.data = "User not found"
            return new Response(JSON.stringify(response))
        }

        let pendingOrders = 0
        let totalOrders = 0
        let totalInterations = 0

        let orders = await prisma.orders.findMany({})
        totalOrders = orders.length

        orders = []
        orders = await prisma.orders.findMany({
            where: {
                userId
            },
        })

        pendingOrders = orders.length

        const interations = await prisma.orderNotes.findMany({
            where: {
                userId
            },
        })

        totalInterations = interations.length

        const data = {
            totalOrders: totalOrders,
            pendingOrders: pendingOrders,
            interations: totalInterations
        }

        response.status = 200
        response.messaage = "Success"
        response.data = data
        return new Response(JSON.stringify(response))
    } catch (error: any) {
        console.log(`[SERVER ERROR] Stats->User->Orders->POST: ${error.message}`)
        response.messaage = error.message
        response.data = error
        return new Response(JSON.stringify(response))
    }

}
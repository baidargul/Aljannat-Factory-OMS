import prisma from "@/lib/prisma";
import { NextRequest } from "next/server";

export async function POST(req: NextRequest) {
    const response = {
        status: 500,
        message: "Internal Server Error",
        data: null as any
    }

    try {

        const { userId } = await req.json()

        const user = await prisma.profile.findUnique({
            where: {
                userId
            }
        })

        if (!user) {
            response.status = 404
            response.message = "User not found"
            return new Response(JSON.stringify(response))
        }

        response.status = 200
        response.message = "User found"
        response.data = user
        return new Response(JSON.stringify(response))
    } catch (error: any) {
        console.log(`[SERVER ERROR]: User->POST: ${error.message}`)
    }


}
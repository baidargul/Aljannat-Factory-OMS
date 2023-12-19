import prisma from "@/lib/prisma";
import { clerkClient } from "@clerk/nextjs";
import { NextRequest } from "next/server";

type reponseType = {
    status: number,
    message: string,
    data: any
}

export async function POST(req: NextRequest) {
    const response: reponseType = {
        status: 500,
        message: 'Internal Server Error',
        data: null
    }

    try {

        const { user } = await req.json()

        const isExists = await prisma.profile.findUnique({
            where: {
                id: user.id
            }
        })

        let orderExists = await prisma.orderNotes.findMany({
            where: {
                userId: user.userId
            }
        })

        if (orderExists.length > 0) {
            await prisma.orderNotes.deleteMany({
                where: {
                    userId: user.userId
                }
            })
        }

        let clerkUser = await clerkClient.users.deleteUser(user.userId).then(async (res) => {
            console.log(res)
        }).catch((err) => {
            console.log(err)
            response.status = 500
            response.message = `[CLERK]: '${err.message}'`
            response.data = null
            return new Response(JSON.stringify(response))
        })

        if (!isExists) {
            response.status = 404
            response.message = 'User not found.'
            return new Response(JSON.stringify(response))
        }

        await prisma.profile.delete({
            where: {
                id: user.id
            }
        })

        response.status = 200
        response.message = 'User deleted successfully.'
        response.data = null
        return new Response(JSON.stringify(response))
    } catch (error: any) {
        console.log(`[SERVER ERROR] ${error.message}`)
        response.status = 500
        response.message = error.message
        response.data = null
        return new Response(JSON.stringify(response))
    }

}
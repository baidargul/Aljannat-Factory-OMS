import prisma from "@/lib/prisma";
import { Role } from "@prisma/client";
import { NextRequest } from "next/server";


type responseType = {
    status: number,
    message: string
    data: any
}

export async function PATCH(req: NextRequest) {

    const response: responseType = {
        status: 500,
        message: 'Internal Server Error',
        data: null
    }

    try {
        let newRole: Role | null = null
        const { user, role } = await req.json()
        newRole = role as Role

        if (!user) {
            response.message = 'User Id is required'
            response.status = 400
            return new Response(JSON.stringify(response))
        }

        if (!newRole) {
            response.message = 'Role is required'
            response.status = 400
            return new Response(JSON.stringify(response))
        }

        console.log(user)
        const isExists = await prisma.profile.findUnique({
            where: {
                id: user.id
            }
        })

        if (!isExists) {
            response.message = 'User not found'
            response.status = 404
            return new Response(JSON.stringify(response))
        }

        const updatedUser = await prisma.profile.update({
            where: {
                id: user.id
            },
            data: {
                role: newRole,
                updatedAt: new Date()
            }
        })

        response.message = 'User role updated successfully'
        response.status = 200
        response.data = updatedUser
        return new Response(JSON.stringify(response))
    } catch (error: any) {
        console.log(`[SERVER ERROR]: ${error.message}`)
        response.message = error.message
        response.status = 500
        response.data = null
        return new Response(JSON.stringify(response))
    }

}
import prisma from "@/lib/prisma";
import { Role } from "@prisma/client";
import { NextRequest } from "next/server";

type Request = {
    status: number,
    message: string,
    data: any
}

export async function GET(req: NextRequest) {

    const response: Request = {
        status: 500,
        message: "Internal Server Error",
        data: null
    }

    try {

        const pendingUsers = await prisma.profile.findMany({
            where: {
                role: Role.UNVERIFIED
            },
            orderBy: {
                createdAt: "asc"
            },
        })

        if (!pendingUsers) {
            response.message = "No pending requests.";
            response.data = null;
        } else {
            response.message = "Pending requests found.";
            response.data = pendingUsers;
        }

        response.status = 200;
        return new Response(JSON.stringify(response))
    } catch (error: any) {
        console.log(`[SERVER ERROR]: ${error.message}`);
        response.status = 500;
        response.message = error.message;
        response.data = null;
        return new Response(JSON.stringify(response))
    }

}
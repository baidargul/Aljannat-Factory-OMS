import prisma from "@/lib/prisma";
import { NextRequest } from "next/server";


type Res = {
    status: number;
    message: string;
    data: any;
}

export async function POST(req: NextRequest) {
    const response: Res = {
        status: 500,
        message: "Bad Request",
        data: req.nextUrl
    }

    try {

        const requested = await req.json()
        const { id } = requested
        if (!id) {
            response.status = 400;
            response.message = "Profile id is required";
            response.data = null;
            return new Response(JSON.stringify(response));
        }

        const user = await prisma.profile.findUnique({
            where: {
                id: id
            }
        })

        if (!user) {
            response.status = 404;
            response.message = "Profile not found";
            response.data = null;
            return new Response(JSON.stringify(response));
        }

        response.status = 200;
        response.message = "Profile found";
        response.data = user;
        return new Response(JSON.stringify(response));

    } catch (error: any) {
        response.status = 500;
        response.message = error.message;
        response.data = null;
        return new Response(JSON.stringify(response));
    }
}
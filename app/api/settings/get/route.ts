import prisma from "@/lib/prisma";
import { NextRequest } from "next/server";

type Res = {
    status: number,
    message: string,
    data?: any
}
export async function POST(req: NextRequest) {
    const response: Res = {
        status: 500,
        message: "Internal Server Error",
        data: null
    }

    try {

        const requested = await req.json()
        const { method, name } = requested

        if (!method) {
            response.status = 400;
            response.message = "Method is required";
            return new Response(JSON.stringify(response))
        }

        if (!name) {
            response.status = 400;
            response.message = "Setting name is required";
            return new Response(JSON.stringify(response))
        }

        let setting
        switch (method) {
            case "READ":
                setting = await READ(name)
                break;

            case "WRITE":
                const { value1, value2, value3 } = requested
                if (!value1 && !value2 && !value3) {
                    response.status = 400;
                    response.message = "At least one value is required";
                    return new Response(JSON.stringify(response))
                }
                setting = await WRITE(name, value1, value2, value3)
                break;

            default:
                break;
        }

        if (!setting) {
            response.status = 404;
            response.message = "Setting can't be processed";
            return new Response(JSON.stringify(response))
        }

        response.status = 200;
        response.message = "Success";
        response.data = setting
        return new Response(JSON.stringify(response))
    } catch (error: any) {
        response.status = 500;
        response.message = error.message;
        response.data = null;
        return new Response(JSON.stringify(response))
    }

}

async function READ(name: string) {
    const setting = await prisma.settings.findUnique({
        include: {
            profile: true
        },
        where: {
            name
        }
    })

    if (!setting) return null
    return setting
}

async function WRITE(name: string, value1?: string, value2?: string, value3?: string) {
    if (!value1 && !value2 && !value3) return null

    let setting
    if (value1) {
        setting = await prisma.settings.update({
            where: {
                name
            },
            data: {
                value1: value1
            }
        })
    }

    if (value2) {
        setting = await prisma.settings.update({
            where: {
                name
            },
            data: {
                value2: value2
            }
        })
    }

    if (value3) {
        setting = await prisma.settings.update({
            where: {
                name
            },
            data: {
                value3: value3
            }
        })
    }

    if (!setting) return null

    setting = await prisma.settings.findUnique({
        include: {
            profile: true
        },
        where: {
            name
        }
    })

    return setting
}
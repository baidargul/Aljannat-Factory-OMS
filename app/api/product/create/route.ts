import prisma from "@/lib/prisma";
import { NextRequest } from "next/server";
import { isNullOrUndefined } from "util";


type Resp = {
    status: number
    message: string
    data: any
}

export async function POST(req: NextRequest) {
    const response: Resp = {
        status: 400,
        message: "Bad Request",
        data: null
    }


    try {

        const requested = await req.json()
        const { name } = requested

        if (!name) {
            response.status = 400
            response.message = "Bad Request"
            response.data = null
            return new Response(JSON.stringify(response))
        }

        const isAlreadyExists = await prisma.product.findUnique({
            where: {
                name
            }
        })

        if (isAlreadyExists) {
            response.status = 400
            response.message = "Product with this name already exists."
            response.data = null
            return new Response(JSON.stringify(response))
        }

        const newProduct = await prisma.product.create({
            data: {
                name: name
            }
        })

        if (!newProduct) {
            response.status = 400
            response.message = "Unable to create product."
            response.data = null
            return new Response(JSON.stringify(response))
        }

        response.status = 200
        response.message = "Success"
        response.data = newProduct
    } catch (error: any) {
        response.status = 500
        response.message = `Internal Server Error! ${error.message}`
        response.data = error
    }

    response.status = 200
    response.message = "Product created!"
    return new Response(JSON.stringify(response))
}
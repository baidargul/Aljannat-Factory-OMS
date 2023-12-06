import prisma from "@/lib/prisma";
import { NextRequest } from "next/server";


type Res = {
    status: number,
    message: string,
    data: any
}

export async function DELETE(req: NextRequest) {
    const response: Res = {
        status: 400,
        message: "Bad Request",
        data: null
    }

    const requested = await req.json()

    try {

        let { name } = requested

        if (!name) {
            response.status = 400,
                response.message = "Product id is required"
            response.data = null
            return new Response(JSON.stringify(response))
        }

        const product = await prisma.product.findFirst({
            where: {
                name: name
            }
        })

        if (!product) {
            response.status = 400,
                response.message = "Product not found in the database."
            response.data = null
            return new Response(JSON.stringify(response))
        }

        const isExists = await prisma.productVariations.findMany({
            where: {
                productId: product.id
            }
        })

        if (isExists.length > 0) {
            response.status = 400,
            response.message = "Product has variations. Please remove variations first."
            response.data = null
            return new Response(JSON.stringify(response))
        }

        await prisma.product.delete({
            where: {
                id: product.id
            }
        })

        response.status = 200
        response.message = "Product removed successfully"
        response.data = null
        return new Response(JSON.stringify(response))
    } catch (error: any) {
        response.status = 500
        response.message = error.message
        response.data = null
        return new Response(JSON.stringify(response))
    }

    response.status = 200
    response.message = "Product removed successfully"
    response.data = null
    return new Response(JSON.stringify(response))
}
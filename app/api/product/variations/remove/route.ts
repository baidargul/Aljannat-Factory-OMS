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
    const { productId, name } = requested

    try {

        if (!productId) {
            response.status = 400,
                response.message = "Product id is required"
            response.data = null
            return new Response(JSON.stringify(response))
        }

        if (!name) {
            response.status = 400,
                response.message = "Variant name is required"
            response.data = null
            return new Response(JSON.stringify(response))
        }

        const product = await prisma.product.findFirst({
            where: {
                id: productId
            }
        })

        if (!product) {
            response.status = 400,
                response.message = "Product not found in the database."
            response.data = null
            return new Response(JSON.stringify(response))
        }

        const variant = await prisma.productVariations.findFirst({
            where: {
                productId: product.id,
                name: String(name).toLocaleLowerCase()
            }
        })

        if (!variant) {
            response.status = 400,
                response.message = "Variant not available in the database."
            response.data = null
            return new Response(JSON.stringify(response))
        }

        const orders = await prisma.ordersRegister.findMany({
            where: {
                variantId: variant.id
            },
        })

        if (orders.length>0) {
            response.status = 400,
            response.message = "Variant is being used in" + orders.length + "orders. Please remove the variant from the orders first."
            response.data = null
            return new Response(JSON.stringify(response))
        }

        await prisma.productVariations.delete({
            where: {
                id: variant.id
            }
        })

        const productDetails = await prisma.product.findFirst({
            include: {
                productVariations: true
            },
            where: {
                id: productId
            },
            orderBy: {
                name: 'asc'
            }
        })

        const variants = await prisma.productVariations.findMany({
            where: {
                productId: productId
            },
            orderBy: {
                name: 'asc'
            }
        })

        const returnData = {
            product: productDetails,
            productVariations: variants
        }

        response.status = 200
        response.message = "Variant removed successfully"
        response.data = returnData
        return new Response(JSON.stringify(response))
    } catch (error: any) {
        response.status = 500,
            response.message = error.message,
            response.data = null
        return new Response(JSON.stringify(response))
    }
}
import prisma from "@/lib/prisma";
import { NextRequest } from "next/server";


type Res = {
    status: number,
    message: string,
    data: any
}
export async function GET(req: NextRequest,props:any) {
    const response:Res = {
        status: 400,
        message: "Bad Request",
        data: null
    }

    const productId = String(props.params.id)

    if (!productId) {
        response.status = 400
        response.message = "Product Id is required!"
        response.data = null
        return new Response(JSON.stringify(response))
    }

    const productExists = await prisma.product.findUnique({
        where: {
            id: productId
        }
    })

    if(!productExists){
        response.status = 404
        response.message = "Product not found!"
        response.data = null
        return new Response(JSON.stringify(response))
    }

    const variations = await prisma.productVariations.findMany({
        where: {
            productId
        }
    })

    if(!variations){
        response.status= 200,
        response.message = "No variations found for this product.",
        response.data=null
        return new Response(JSON.stringify(response))
    }

    response.status = 200
    response.message = "Success"
    response.data = variations
    return new Response(JSON.stringify(response))
}
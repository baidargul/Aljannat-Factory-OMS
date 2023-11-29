import prisma from "@/lib/prisma"
import { NextRequest } from "next/server";

export async function GET(req: NextRequest, props: any) {
    const response = {
        status: 400,
        message: "Bad Request",
        data: null as any
    }

    const { phone } = props.params;

    console.log(`Searching customer:`, phone)
    if(phone === "00000000001")
    {
        response.status = 404
        response.message = `Customer with phone ${phone} not found`
        response.data = null
        return new Response(JSON.stringify(response))
    }

    let customer = await prisma.customers.findFirst({
        where: {
            phone: phone
        },
        orderBy:{
            createdAt: 'desc'
        }
    })

    if(!customer){
        customer = await prisma.customers.findFirst({
            where: {
                phone2: phone
            },
            orderBy:{
                createdAt: 'desc'
            }
        })
    }

    if(!customer){
        response.status = 404
        response.message = `Customer with phone ${phone} not found`
        response.data = null
        return new Response(JSON.stringify(response))
    }

    if(customer?.phone==="00000000001")
    {
        customer.phone= ""
    }
    if(customer?.phone2==="00000000001")
    {
        customer.phone2= ""
    }


    if(customer){
        response.status = 200
        response.message = `Customer with phone ${phone} found`
        response.data = customer
    }

    return new Response(JSON.stringify(response))
}
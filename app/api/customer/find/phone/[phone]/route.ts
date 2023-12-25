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
    if (phone === "00000000001") {
        response.status = 404
        response.message = `Customer with phone ${phone} not found`
        response.data = null
        return new Response(JSON.stringify(response))
    }

    let customer = await prisma.customers.findFirst({
        where: {
            phone: phone
        },
        orderBy: {
            createdAt: 'desc'
        }
    })

    if (!customer) {
        customer = await prisma.customers.findFirst({
            where: {
                phone2: phone
            },
            orderBy: {
                createdAt: 'desc'
            }
        })
    }

    if (!customer) {
        response.status = 404
        response.message = `Customer with phone ${phone} not found`
        response.data = null
        return new Response(JSON.stringify(response))
    }

    if (customer?.phone === "00000000001") {
        customer.phone = ""
    }
    if (customer?.phone2 === "00000000001") {
        customer.phone2 = ""
    }

    const lastOrderFromThisCustomer = await prisma.orders.findFirst({
        where: {
            customerId: customer.id
        },
        orderBy: {
            createdAt: 'desc'
        }
    })



    if (customer) {
        const minimumOrderDayThreshold = 4

        let customerCanOrder = true
        if (lastOrderFromThisCustomer) {
            const lastOrderDate = new Date(lastOrderFromThisCustomer.createdAt)
            const today = new Date()
            const diffTime = Math.abs(today.getTime() - lastOrderDate.getTime());
            const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
            if (diffDays > minimumOrderDayThreshold) {
                customerCanOrder = true
            } else {
                customerCanOrder = false
            }
        }

        if (!customerCanOrder) {
            response.status = 403
            response.message = `An order found for this customer in the last ${minimumOrderDayThreshold} days`
            response.data = customer
            return new Response(JSON.stringify(response))
        }
        
        response.status = 200
        response.message = `Customer with phone ${phone} found`
        response.data = customer
    }

    return new Response(JSON.stringify(response))
}
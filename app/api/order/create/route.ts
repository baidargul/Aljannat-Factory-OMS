import prisma from "@/lib/prisma";
import { NextRequest } from "next/server";
import { v4 } from "uuid";


export async function POST(req: NextRequest) {
    const response = {
        status: 400,
        message: "Bad Request",
        data: null as any
    }

    try {
        const data = await req.json()

        if (!data) {
            response.status = 400
            response.message = "No data submitted"
            response.data = null
            return new Response(JSON.stringify(response))
        }

        const { customer, products, userId, dateOfBooking, dateOfDelivery } = data

        console.log(products)

        if (!customer.name) {
            response.status = 400
            response.message = "Customer name is required"
            response.data = null
            return new Response(JSON.stringify(response))
        }

        if (!customer.phone) {
            response.status = 400
            response.message = "Customer phone is required! Please enter a phone number in 'Phone 01'."
            response.data = null
            return new Response(JSON.stringify(response))
        }

        if (!customer.phone2) {
            customer.phone2 = ""
        }

        if (!customer.city) {
            response.status = 400
            response.message = "Customer city is required"
            response.data = null
            return new Response(JSON.stringify(response))
        }

        if (!customer.address) {
            response.status = 400
            response.message = "Customer address is required"
            response.data = null
            return new Response(JSON.stringify(response))
        }

        //Verifications that all products have necessary information filled
        for (const item of products) {
            if (item.productName === "" || !item.productName) {
                response.status = 400
                response.message = "Product name is required"
                response.data = null
                return new Response(JSON.stringify(response))
            }

            let exists = await prisma.product.findFirst({
                where: {
                    name: String(item.productName).toLocaleLowerCase()
                }
            })

            if (!exists) {
                response.status = 400
                response.message = `Product ${item.productName} not exists in database.`
                response.data = null
                return new Response(JSON.stringify(response))
            }

            if (item.variantName === "" || !item.variantName) {
                response.status = 400
                response.message = "Variant name is required"
                response.data = null
                return new Response(JSON.stringify(response))
            }

            exists = await prisma.productVariations.findFirst({
                where: {
                    name: String(item.variantName).toLocaleLowerCase(),
                    productId: exists.id
                }
            })

            if (!exists) {
                response.status = 400
                response.message = `Product variation ${item.variantName} not exists in database.`
                response.data = null
                return new Response(JSON.stringify(response))
            }

            if (item.weight === "" || !item.weight) {
                response.status = 400
                response.message = "Weight is required"
                response.data = null
                return new Response(JSON.stringify(response))
            }

            if (item.amount === "" || !item.amount) {
                response.status = 400
                response.message = "Amount is required"
                response.data = null
                return new Response(JSON.stringify(response))
            }
        }

        let isExists = await prisma.customers.findFirst({
            where: {
                phone: customer.phone
            },
            orderBy: {
                createdAt: "desc"
            }
        })

        if (!isExists) {
            if (customer.phone2) {
                isExists = await prisma.customers.findFirst({
                    where: {
                        phone2: customer.phone2
                    }
                })
            }
        }

        let dbCustomer;
        if (!isExists) {
            dbCustomer = await prisma.customers.create({
                data: {
                    id: v4(),
                    name: customer.name,
                    phone: customer.phone,
                    phone2: customer.phone2,
                    city: customer.city,
                    address: customer.address
                }
            })
        } else {
            dbCustomer = isExists
        }

        const profile = await prisma.profile.findUnique({
            where: {
                userId: userId
            }
        })

        let newOrder = await prisma.orders.create({
            data: {
                id: v4(),
                status: "BOOKED",
                userId: userId,
                customerId: dbCustomer.id,
                dateOfBooking: dateOfBooking,
                dateOfDelivery: dateOfDelivery
            }
        })

        const newNote = await prisma.orderNotes.create({
            data: {
                id: v4(),
                note: profile ? `${profile.name} created this order.` : `Non profiled user created this order.`,
                orderId: newOrder.id,
                userId: userId
            }
        })

        newOrder = await prisma.orders.update({
            where: {
                id: newOrder.id
            },
            data: {
                noteId: newNote.id
            }
        })

        for (const item of products) {
            const product = await prisma.product.findUnique({
                where: {
                    name: String(item.productName).toLocaleLowerCase()
                }
            })

            if (!product) {
                response.status = 400
                response.message = `Product ${item.productName} not found.`
                response.data = null
                return new Response(JSON.stringify(response))
            }

            const variation = await prisma.productVariations.findFirst({
                where: {
                    name: String(item.variantName).toLocaleLowerCase(),
                    productId: product.id
                }
            })

            if (!variation) {
                response.status = 400
                response.message = `Product variation ${item.variantName} not found.`
                response.data = null
                return new Response(JSON.stringify(response))
            }

            const orderRegister = await prisma.ordersRegister.create({
                data: {
                    id: v4(),
                    orderId: newOrder.id,
                    productId: product.id,
                    variantId: variation.id,
                    weight: Number(item.weight),
                    amount: Number(item.amount)
                }
            })
            if (!orderRegister) {
                response.status = 400
                response.message = `Unable to create order register for ${item.productName} ${item.variantName}.`
                response.data = null
                return new Response(JSON.stringify(response))
            }
        }

        response.status = 200
        response.message = "Order created successfully"
        response.data = { ...newOrder, orderRegister: { ...products }, customer: { ...dbCustomer } }
    } catch (error) {
        console.log(`[ORDER CREATE]-ERROR: `, error)
        response.status = 500
        response.message = "Internal Server Error"
        response.data = null
    }



    return new Response(JSON.stringify(response))
}
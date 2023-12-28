import prisma from '@/lib/prisma';
import { NextRequest } from 'next/server';
import { v4 } from 'uuid';

export async function POST(req: NextRequest) {

    const response = {
        status: 500,
        message: 'Internal Server Error',
        data: null as any
    }

    try {

        const data = await req.json()
        let freshOrder = null

        if (!data) {
            response.status = 400
            response.message = "No data submitted"
            response.data = null
            return new Response(JSON.stringify(response))
        }

        const { customer, products, userId, dateOfBooking, dateOfDelivery } = data

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

        const customerCity = await prisma.logisticsCities.findUnique({
            where: {
                City: String(customer.city).toLocaleUpperCase()
            }
        })

        if (!customerCity) {
            response.status = 400
            response.message = `City ${customer.city} not found in database.`
            response.data = null
            return new Response(JSON.stringify(response))
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
                    cityId: customerCity.id,
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

        const order = await prisma.orders.update({
            data: {
                dateOfBooking: dateOfBooking,
                dateOfDelivery: dateOfDelivery,
                customerId: dbCustomer.id,
                updatedAt: new Date(),
            },
            where: {
                id: data.id
            }
        })

        const newNote = await prisma.orderNotes.create({
            data: {
                id: v4(),
                note: profile ? `${profile.name} updated this order.` : `Non profiled user updated this order.`,
                orderId: order.id,
                userId: userId
            }
        })

        await prisma.orders.update({
            where: {
                id: order.id
            },
            data: {
                noteId: newNote.id
            }
        })

        await prisma.ordersRegister.deleteMany({
            where: {
                orderId: order.id
            }
        })

        for (const item of products) {
            const product = await prisma.product.findFirst({
                where: {
                    name: String(item.productName).toLocaleLowerCase()
                }
            })

            const variant = await prisma.productVariations.findFirst({
                where: {
                    name: String(item.variantName).toLocaleLowerCase(),
                    productId: product?.id
                }
            })

            await prisma.ordersRegister.create({
                data: {
                    id: v4(),
                    orderId: order.id,
                    productId: product?.id,
                    variantId: variant?.id,
                    weight: Number(item.weight),
                    amount: Number(item.amount),
                }
            })

            freshOrder = await prisma.orders.findUnique({
                include: {
                    customers: {
                        include: {
                            logisticsCities: true,
                        }
                    },
                    profile: true,
                    orderNotes: {
                        orderBy: {
                            createdAt: "desc",
                        }
                    },
                    ordersRegister: {
                        include: {
                            productVariations: {
                                select: {
                                    name: true,
                                    defaultUnit: true,
                                }
                            },
                            product: {
                                select: {
                                    id: true,
                                    name: true,
                                }
                            },
                        }
                    },
                },
                where: {
                    id: order.id
                }
            });

        }

        response.status = 200
        response.message = "Order updated successfully."
        response.data = freshOrder
        return new Response(JSON.stringify(response))
    } catch (error: any) {
        console.log('[SERVER ERROR]: ' + error.message);
        response.status = 500;
        response.message = error.message;
        response.data = null;
        return new Response(JSON.stringify(response));
    }

}
import prisma from "@/lib/prisma";
import axios from "axios";
import { NextRequest } from "next/server";

type ResponseType = {
    status: number,
    message: string,
    data: any
}

export async function POST(req: NextRequest): Promise<void | Response> {
    const response: ResponseType = {
        status: 500,
        message: 'Internal Server Error',
        data: {}
    }

    try {
        let freshOrder = null;
        let trackingNo = "";

        const requested = await req.json();
        const { row, userId } = requested;
        console.log(row);

        let productNames = ""
        row.ordersRegister.map((item: any) => {
            productNames += `${String(item.product.name).toLocaleUpperCase()}(${String(item.productVariations.name).toLocaleUpperCase()} x ${item.weight}${String(item.productVariations.defaultUnit).toLocaleUpperCase()}), `
        })

        let totalWeight = 0;
        row.ordersRegister.map((item: any) => {
            totalWeight += item.weight
        })

        let totalAmount = 0;
        row.ordersRegister.map((item: any) => {
            totalAmount += item.amount
        })

        let totalPcs = row.ordersRegister.length;

        const MnPData = {
            username: "daniyal_7a69",
            password: "wednesday1289@",
            consigneeName: `test--${row.customers.name}`,
            consigneeAddress: row.customers.address,
            consigneeMobNo: row.customers.phone,
            destinationCityName: row.customers.city,
            pieces: 1,
            weight: totalWeight,
            codAmount: totalAmount,
            custRefNo: row.id,
            productDetails: productNames,
            fragile: "No",
            Service: "Overnight",
            InsuranceValue: 0,
        }

        await axios.post("http://mnpcourier.com/mycodapi/api/Booking/InsertBookingData", { ...MnPData }).then(async (res) => {
            const returnedResponse = res.data;
            console.log(`M&P Response:`, returnedResponse[0].isSuccess)
            if (returnedResponse[0].isSuccess === "false") {
                console.log(`Error in Dispatch`)
                freshOrder = await prisma.orders.findUnique({
                    include: {
                        customers: true,
                        profile: true,
                        orderNotes: {
                            include: {
                                profile: true,
                            },
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
                        id: row.id
                    }
                });

                response.status = 400;
                response.message = returnedResponse[0].message;
                response.data = freshOrder;
                return new Response(JSON.stringify(response))
            } else {
                const trackingId = returnedResponse[0].orderReferenceId;
                console.log(`Tracking number allotted:`, trackingId)
                trackingNo = trackingId;
                if (trackingId) {
                    await prisma.orders.update({
                        where: {
                            id: row.id
                        },
                        data: {
                            trackingNo: trackingId,
                            courier: "M&P"
                        }
                    })

                }

                freshOrder = await prisma.orders.findUnique({
                    include: {
                        customers: true,
                        profile: true,
                        orderNotes: {
                            include: {
                                profile: true,
                            },
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
                        id: row.id
                    }
                });

                response.status = 200;
                response.message = "Order is ready for dispatch from M&P";
                response.data = freshOrder;
                return new Response(JSON.stringify(response))
            }

            return new Response(JSON.stringify(response))
        }).catch((err) => {
            console.log(`DISPATCH_MNP_BOOK_ROUTE_ERROR from CourierAPI: ${err}`)
            response.status = 500;
            response.message = "Internal Server Error";
            response.data = null;
        })
    } catch (error) {
        console.log(`DISPATCH_MNP_BOOK_ROUTE_ERROR from CourierAPI: ${error}`);
        response.status = 500;
        response.message = "Internal Server Error";
        response.data = null;
        return new Response(JSON.stringify(response));
    }
    
    return new Response(JSON.stringify(response))
}
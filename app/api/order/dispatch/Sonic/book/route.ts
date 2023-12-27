import prisma from "@/lib/prisma";
import axios from "axios";
import { NextRequest } from "next/server";

type ResponseType = {
    status: number,
    message: string,
    data: any
}
export async function POST(req: NextRequest) {
    const response: ResponseType = {
        status: 500,
        message: 'Internal Server Error',
        data: null
    }
    let trackingNo = "";
    let freshOrder = null;

    try {

        const requested = await req.json();
        const { row, userId } = requested;
        console.log(row)

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
            if (returnedResponse[0].isSuccess !== "true") {
                response.status = 500;
                response.message = returnedResponse[0].message;
                response.data = null;
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
                        customers: {
                            include:{
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
                        id: row.id
                    }
                });

                response.status = 200;
                response.message = "Order is ready for dispatch from M&P";
                response.data = freshOrder;
            }
        }).catch((err) => {
            console.log(`DISPATCH_MNP_BOOK_ROUTE_ERROR from CourierAPI: ${err}`)
            response.status = 500;
            response.message = "Internal Server Error";
            response.data = null;
        })



    } catch (error) {
        console.log(`DISPATCH_MNP_BOOK_ROUTE_ERROR: ${error}`)
        response.status = 500;
        response.message = "Internal Server Error";
        response.data = null;
        return new Response(JSON.stringify(response));
    }

    response.status = 200;
    response.message = "Success Dispatch MNP Book";
    response.data = freshOrder;
    return new Response(JSON.stringify(response))
}
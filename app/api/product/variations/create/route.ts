import AWS from "aws-sdk";
import prisma from "@/lib/prisma";
import { NextRequest } from "next/server";

type Res = {
    status: number,
    message: string,
    data: any
}

export async function POST(req: NextRequest) {
    const response: Res = {
        status: 400,
        message: "Bad Request",
        data: null
    }

    const requested = await req.json()

    try {

        let { name, weight, price, unit, image, fileName, productId } = requested

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

        if (weight < 0) {
            response.status = 400,
                response.message = "Please enter valid weight"
            response.data = null
            return new Response(JSON.stringify(response))
        }

        if (!weight) {
            weight = 0
        }

        if (!price) {
            price = 0
        }

        if (!unit) {
            unit = "kg"
        }

        // if (!image) {
        //     response.status = 400,
        //         response.message = "Variant image is required"
        //     response.data = null
        // }

        if (!fileName) {
            response.status = 400,
                response.message = "Variant image is required"
            response.data = null
        }


        let isExists = await prisma.product.findFirst({
            where: {
                id: productId
            }
        })

        if (!isExists) {
            response.status = 400,
                response.message = "Product not found"
            response.data = null
            return new Response(JSON.stringify(response))
        }

        isExists = await prisma.productVariations.findFirst({
            where: {
                name: String(name).toLocaleLowerCase(),
                productId: productId
            }
        })

        if (isExists) {
            response.status = 400,
                response.message = "Variant with this name already exists!"
            response.data = null
            return new Response(JSON.stringify(response))
        }

        // Decode base64 image data
        // const decodedImageData = Buffer.from(image.split(",")[1], "base64");

        // AWS configuration
        // const s3 = new AWS.S3({
        //     accessKeyId: "AKIATIQPEIGEHWZIEOP3",
        //     secretAccessKey: "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",
        //     region: "ap-south-1",
        // });

        // S3 parameters
        // const fileContent = decodedImageData;
        // const fileType = String(name).toLocaleLowerCase() + `.` + fileExtension(fileName);
        // const params = {
        //     Bucket: "aljannat/orderPortal/products/variants",
        //     Key: fileType,
        //     Body: fileContent,
        // };

        // Upload to S3
        // const result = await s3.upload(params).promise();
        // Save to database
        // let fileUrl
        // fileUrl = result.Location;
        // const base64FileContent = fileContent.toString("base64");

        const newVariant = await prisma.productVariations.create({
            data: {
                name: String(name).toLocaleLowerCase(),
                imageUrl: null,//fileUrl,
                defaultWeight: Number(weight),
                defaultAmount: Number(price),
                defaultUnit: unit,
                productId: productId
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


        response.status = 200,
            response.message = "Variant created successfully"
        response.data = returnData
        return new Response(JSON.stringify(response))
    } catch (error: any) {
        response.status = 400,
            response.message = "Server error: " + error.message
        response.data = null
        return new Response(JSON.stringify(response))
    }

    return new Response(JSON.stringify(response))
}

function fileExtension(fileName: string) {
    return String(fileName.split('.').pop());
}
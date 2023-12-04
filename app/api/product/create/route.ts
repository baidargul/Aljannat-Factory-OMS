import AWS from "aws-sdk";
import prisma from "@/lib/prisma";
import { NextRequest } from "next/server";


type Resp = {
    status: number
    message: string
    data: any
}

export async function POST(req: NextRequest) {
    const response: Resp = {
        status: 400,
        message: "Bad Request",
        data: null
    }


    try {

        const requested = await req.json()
        const { name, image } = requested

        if (!name) {
            response.status = 400
            response.message = "Product name is required."
            response.data = null
            return new Response(JSON.stringify(response))
        }

        if (!image) {
            response.status = 400
            response.message = "Image is required."
            response.data = null
            return new Response(JSON.stringify(response))
        }

        const bytes = await image.arrayBuffer();
        const buffer = Buffer.from(bytes);

        // AWS configuration
        const s3 = new AWS.S3({
            accessKeyId: "AKIATIQPEIGEHWZIEOP3",
            secretAccessKey: "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",
            region: "ap-south-1",
        });

        // S3 parameters
        const fileContent = buffer;
        const params = {
            Bucket: "aljannat/orderPortal/products",
            Key: name,
            Body: fileContent,
        };

        // Upload to S3
        const result = await s3.upload(params).promise();
        // Save to database
        let fileUrl
        fileUrl = result.Location;
        const base64FileContent = fileContent.toString("base64");

        const check = await prisma.product.findFirst({
            where: {
                name: name,
            },
        });

        if (check) {
            await prisma.product.update({
                where: {
                    id: check.id
                },
                data: {
                    name: name,
                    imageUrl: fileUrl
                }
            })
        }

        const isAlreadyExists = await prisma.product.findUnique({
            where: {
                name
            }
        })

        if (isAlreadyExists) {
            response.status = 400
            response.message = "Product with this name already exists."
            response.data = null
            return new Response(JSON.stringify(response))
        }

        const newProduct = await prisma.product.create({
            data: {
                name: name
            }
        })

        if (!newProduct) {
            response.status = 400
            response.message = "Unable to create product."
            response.data = null
            return new Response(JSON.stringify(response))
        }

        response.status = 200
        response.message = "Success"
        response.data = newProduct
    } catch (error: any) {
        response.status = 500
        response.message = `Internal Server Error! ${error.message}`
        response.data = error
    }

    response.status = 200
    response.message = "Product created!"
    return new Response(JSON.stringify(response))
}
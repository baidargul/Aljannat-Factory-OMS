import prisma from '@/lib/prisma';
import { NextRequest } from 'next/server';

export async function POST(req: NextRequest) {

    const response = {
        status: 500,
        message: 'Internal Server Error',
        data: null as any
    }

    try {

        const { name, value1, value2, value3 } = await req.json()

        if (!name) {
            response.status = 400;
            response.message = 'Bad Request';
            return new Response(JSON.stringify(response));
        }

        const isExists = await prisma.settings.findUnique({
            where: {
                name
            }
        })

        if (isExists) {
            response.status = 400;
            response.message = 'Setting already exists';
            return new Response(JSON.stringify(response));
        }

        const setting = await prisma.settings.create({
            data: {
                name,
                value1,
                value2,
                value3
            }
        })

        response.status = 200;
        response.message = 'New setting created';
        response.data = setting;
        return new Response(JSON.stringify(response));
    } catch (error: any) {
        console.log('[SERVER ERROR]: ' + error.message);
        response.status = 500;
        response.message = error.message;
        response.data = null;
        return new Response(JSON.stringify(response));
    }

}
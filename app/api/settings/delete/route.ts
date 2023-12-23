import prisma from '@/lib/prisma';
import { NextRequest } from 'next/server';

export async function POST(req: NextRequest) {

    const response = {
        status: 500,
        message: 'Internal Server Error',
        data: null as any
    }

    try {

        const { id } = await req.json()

        if (!id) {
            response.status = 400;
            response.message = 'Setting id is required';
            return new Response(JSON.stringify(response));
        }

        const setting = await prisma.settings.findUnique({
            where: {
                id
            }
        })

        if(!setting){
            response.status = 404;
            response.message = 'Setting not found';
            return new Response(JSON.stringify(response));
        }

        await prisma.settings.delete({
            where: {
                id
            }
        })

        response.status = 200;
        response.message = 'Setting removed successfully';
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
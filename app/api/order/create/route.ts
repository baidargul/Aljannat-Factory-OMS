import { NextRequest } from "next/server";


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

        const { customer, products } = data

        console.log(products)

        if(!customer.name) 
        {
            response.status = 400
            response.message = "Customer name is required"
            response.data = null
            return new Response(JSON.stringify(response))
        }

        if(!customer.phone) 
        {
            response.status = 400
            response.message = "Customer phone is required"
            response.data = null
            return new Response(JSON.stringify(response))
        }

        if(!customer.phone2)
        {
            customer.phone2= ""
        }

        if(!customer.city)
        {
            response.status = 400
            response.message = "Customer city is required"
            response.data = null
            return new Response(JSON.stringify(response))
        }

        if(!customer.address) 
        {
            response.status = 400
            response.message = "Customer address is required"
            response.data = null
            return new Response(JSON.stringify(response))
        }

        //Verifications that all products have necessary information filled
        products.map((product:any)=>{
            if(product.productName === "" || !product.productName)
            {
                response.status = 400
                response.message = "Product name is required"
                response.data = null
                return new Response(JSON.stringify(response))
            }

            if(product.variantName === "" || !product.variantName)
            {
                response.status = 400
                response.message = "Variant name is required"
                response.data = null
                return new Response(JSON.stringify(response))
            }

            if(product.weight === "" || !product.weight)
            {
                response.status = 400
                response.message = "Weight is required"
                response.data = null
                return new Response(JSON.stringify(response))
            }

            if(product.amount === "" || !product.amount)
            {
                response.status = 400
                response.message = "Amount is required"
                response.data = null
                return new Response(JSON.stringify(response))
            }
        })

        


    } catch (error) {
        console.log(`[ORDER CREATE]-ERROR: `, error)
        response.status = 500
        response.message = "Internal Server Error"
        response.data = null
    }



    return new Response(JSON.stringify(response))
}
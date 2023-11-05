import AWS from "aws-sdk";
import { config as configDotenv } from "dotenv";
import prisma from "@/lib/prisma";
import { v4 } from "uuid";

configDotenv();

export async function POST(req: any) {
  const response = {
    status: 400,
    message: "",
    data: {},
  };
  const requested = await req.json();
  const { data, fileName } = requested;

  // AWS configuration
  const s3 = new AWS.S3({
    accessKeyId: "AKIATIQPEIGEHWZIEOP3",
    secretAccessKey: "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",
    region: "ap-south-1",
  });

  // Decode Base64 data to a Buffer
  const fileContent = Buffer.from(data, "base64");

  // S3 parameters
  const params = {
    Bucket: "aljannat/exceltodatabase/raw",
    Key: fileName,
    Body: fileContent,
  };

  // Upload to S3
  try {
    const result = await s3.upload(params).promise();
    response.status = 200;

    // Save to database

    const fileUrl = result.Location;

    const base64FileContent = fileContent.toString("base64");

    const check = await prisma.sheets.findFirst({
      where: {
        name: fileName,
      },
    })

    if(check) {
      await prisma.sheets.deleteMany({
        where: {
          name: fileName,
        },
      })
    }

    const file = await prisma.sheets.create({
      data: {
        id: v4(),
        name: fileName,
        url: fileUrl,
        content: base64FileContent,
      },
    });

    response.message = `File '${fileName}' uploaded to successfully`;
    response.data = {
      ...result,
      redirectTo: `/file/process/${file.id}/`,
      file: fileContent,
    };

    // const order = await prisma.orders.create({
    //   data: {
    //     id: v4(),
    //     customerId: "baidar gul",
    //     amount: 100,
    //     confirmedBy: "baidar gul",
    //     courier: "M&P",
    //     note: "order verified",
    //     product: "Sohan halwa",
    //     weight: "1KG",
    //     status: "pending",
    //     trackingNo: "123456789",
    //     variant: "Sadah",
    //   },
    // });

    return new Response(JSON.stringify(response));
  } catch (error: any) {
    response.status = 500;
    response.message = error.message;
    response.data = {};
    return new Response(JSON.stringify(response), {
      status: 500,
    });
  }
}

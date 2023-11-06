import AWS from "aws-sdk";
import { config as configDotenv } from "dotenv";
import prisma from "@/lib/prisma";
import { v4 } from "uuid";
import { NextRequest } from "next/server";

configDotenv();

export async function POST(req: NextRequest) {
  const response = {
    status: 400,
    message: "",
    data: {},
  };

  const data = await req.formData();
  const file: File | null = data.get("file") as unknown as File;
  const fileName = file?.name;
  
  if (!file) {
    response.status = 400;
    response.message = "File not found";
    response.data = {};
  }
  
  const bytes = await file.arrayBuffer();
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

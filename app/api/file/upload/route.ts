import AWS from "aws-sdk";
import { config as configDotenv } from "dotenv";

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
    response.message = "File uploaded to S3";
    response.data = result;
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

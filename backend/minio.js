import { Client } from "minio";

export const minioClient = new Client({
  endPoint: "minio",
  port: 9000,
  useSSL: false,
  accessKey: "minioadmin",
  secretKey: "minioadmin123",
});

export const bucket = "uploads";

export async function initBucket() {
  const exists = await minioClient.bucketExists(bucket);
  if (!exists) {
    await minioClient.makeBucket(bucket);
  }
}
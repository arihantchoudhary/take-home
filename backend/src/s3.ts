import { S3Client, PutObjectCommand } from '@aws-sdk/client-s3';
import { v4 as uuidv4 } from 'uuid';

// Initialize S3 client
const s3Client = new S3Client({
  region: process.env.AWS_REGION || 'us-east-1',
});

const BUCKET_NAME = process.env.S3_BUCKET_NAME || 'dev-notion-images-050451400186';

/**
 * Upload a base64-encoded image to S3
 * @param base64Data - The base64-encoded image data (with or without data URI prefix)
 * @param contentType - The MIME type of the image (e.g., 'image/png')
 * @returns The S3 URL of the uploaded image
 */
export async function uploadImageToS3(base64Data: string, contentType: string = 'image/png'): Promise<string> {
  // Remove data URI prefix if present (e.g., "data:image/png;base64,")
  const base64Content = base64Data.includes(',')
    ? base64Data.split(',')[1]
    : base64Data;

  // Convert base64 to buffer
  const buffer = Buffer.from(base64Content, 'base64');

  // Generate unique filename
  const fileExtension = contentType.split('/')[1] || 'png';
  const fileName = `images/${uuidv4()}.${fileExtension}`;

  // Upload to S3
  const command = new PutObjectCommand({
    Bucket: BUCKET_NAME,
    Key: fileName,
    Body: buffer,
    ContentType: contentType,
  });

  await s3Client.send(command);

  // Return the public URL
  const s3Url = `https://${BUCKET_NAME}.s3.${process.env.AWS_REGION || 'us-east-1'}.amazonaws.com/${fileName}`;
  return s3Url;
}

/**
 * Check if a string is a base64-encoded image (data URI)
 */
export function isBase64Image(str: string): boolean {
  return str.startsWith('data:image/');
}

/**
 * Extract content type from base64 data URI
 */
export function getContentTypeFromDataUri(dataUri: string): string {
  const match = dataUri.match(/^data:(image\/[a-z]+);base64,/);
  return match ? match[1] : 'image/png';
}

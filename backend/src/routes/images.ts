import { Router, Request, Response } from 'express';
import { S3Client, PutObjectCommand, DeleteObjectCommand } from '@aws-sdk/client-s3';
import { getSignedUrl } from '@aws-sdk/s3-request-presigner';
import { v4 as uuidv4 } from 'uuid';

const router = Router();

// Initialize S3 client
const s3Client = new S3Client({
  region: process.env.AWS_REGION || 'us-east-1',
});

const BUCKET_NAME = process.env.S3_IMAGES_BUCKET || 'dev-notion-images-050451400186';
const BUCKET_URL = `https://${BUCKET_NAME}.s3.${process.env.AWS_REGION || 'us-east-1'}.amazonaws.com`;

// POST /api/images/upload-url - Get presigned URL for upload
router.post('/upload-url', async (req: Request, res: Response) => {
  try {
    const { fileName, fileType } = req.body;

    if (!fileName || !fileType) {
      return res.status(400).json({ error: 'fileName and fileType are required' });
    }

    // Generate unique file name
    const fileExtension = fileName.split('.').pop();
    const uniqueFileName = `${uuidv4()}.${fileExtension}`;
    const key = `images/${uniqueFileName}`;

    // Create presigned URL for upload
    const command = new PutObjectCommand({
      Bucket: BUCKET_NAME,
      Key: key,
      ContentType: fileType,
    });

    const uploadUrl = await getSignedUrl(s3Client, command, { expiresIn: 300 }); // 5 minutes
    const publicUrl = `${BUCKET_URL}/${key}`;

    res.json({
      uploadUrl,
      publicUrl,
      key,
      fileName: uniqueFileName,
    });
  } catch (error) {
    console.error('Error generating presigned URL:', error);
    res.status(500).json({ error: 'Failed to generate upload URL' });
  }
});

// DELETE /api/images/:key - Delete an image
router.delete('/:key(*)', async (req: Request, res: Response) => {
  try {
    const key = req.params.key;

    if (!key) {
      return res.status(400).json({ error: 'Image key is required' });
    }

    const command = new DeleteObjectCommand({
      Bucket: BUCKET_NAME,
      Key: key,
    });

    await s3Client.send(command);

    res.json({ message: 'Image deleted successfully', key });
  } catch (error) {
    console.error('Error deleting image:', error);
    res.status(500).json({ error: 'Failed to delete image' });
  }
});

// GET /api/images/info - Get bucket information
router.get('/info', async (req: Request, res: Response) => {
  try {
    res.json({
      bucketName: BUCKET_NAME,
      bucketUrl: BUCKET_URL,
      region: process.env.AWS_REGION || 'us-east-1',
    });
  } catch (error) {
    console.error('Error getting bucket info:', error);
    res.status(500).json({ error: 'Failed to get bucket info' });
  }
});

export default router;

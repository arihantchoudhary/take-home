import { Router, Request, Response } from 'express';
import * as dynamodb from '../dynamodb';
import { Block } from '../types';
import { uploadImageToS3, isBase64Image, getContentTypeFromDataUri } from '../s3';

const router = Router();

// GET /api/blocks?pageId=xxx - Get blocks for a page (or all if no pageId)
router.get('/', async (req: Request, res: Response) => {
  try {
    const { pageId } = req.query;

    let blocks;
    if (pageId && typeof pageId === 'string') {
      blocks = await dynamodb.getPageBlocks(pageId);
    } else {
      // Return blocks for default page if no pageId specified
      blocks = await dynamodb.getPageBlocks('default-page');
    }

    // Transform backend schema to frontend schema
    const response = blocks.map(block => ({
      ...block,
      id: block.blockId,
    }));

    res.json(response);
  } catch (error) {
    console.error('Error fetching blocks:', error);
    res.status(500).json({ error: 'Failed to fetch blocks' });
  }
});

// POST /api/blocks - Create a new block
router.post('/', async (req: Request, res: Response) => {
  try {
    const incomingData = req.body;

    console.log('Received POST /api/blocks:', JSON.stringify(incomingData, null, 2));

    if (!incomingData.type) {
      console.error('Missing type field. Received:', incomingData);
      return res.status(400).json({ error: 'Missing required field: type', received: incomingData });
    }

    // Transform frontend schema to backend schema
    const now = Date.now();
    const blockData: Block = {
      ...incomingData,
      blockId: incomingData.id || incomingData.blockId || `block_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      pageId: incomingData.pageId || 'default-page',
      order: incomingData.order || 0,
      createdAt: incomingData.createdAt || now,
      updatedAt: incomingData.updatedAt || now,
      createdBy: incomingData.createdBy || 'anonymous',
    } as Block;

    // Remove the old 'id' field if it exists
    delete (blockData as any).id;

    const block = await dynamodb.createBlock(blockData, blockData.createdBy);

    // Transform back to frontend schema for response
    const response = {
      ...block,
      id: block.blockId,
    };

    res.status(201).json(response);
  } catch (error) {
    console.error('Error creating block:', error);
    res.status(500).json({ error: 'Failed to create block' });
  }
});

// GET /api/blocks/:blockId - Get a block
router.get('/:blockId', async (req: Request, res: Response) => {
  try {
    const { blockId } = req.params;
    const block = await dynamodb.getBlock(blockId);

    if (!block) {
      return res.status(404).json({ error: 'Block not found' });
    }

    // Transform to frontend schema
    const response = {
      ...block,
      id: block.blockId,
    };

    res.json(response);
  } catch (error) {
    console.error('Error fetching block:', error);
    res.status(500).json({ error: 'Failed to fetch block' });
  }
});

// PUT /api/blocks/:blockId - Update a block
router.put('/:blockId', async (req: Request, res: Response) => {
  try {
    const { blockId } = req.params;
    const updates = req.body;

    // Remove 'id' from updates if present (use blockId instead)
    delete (updates as any).id;

    // If this is an image block with base64 data, upload to S3 first
    if (updates.type === 'image' && updates.content && isBase64Image(updates.content)) {
      console.log('[BLOCKS] Detected base64 image, uploading to S3...');
      const contentType = getContentTypeFromDataUri(updates.content);
      const s3Url = await uploadImageToS3(updates.content, contentType);
      console.log('[BLOCKS] Image uploaded to S3:', s3Url);
      updates.content = s3Url;
    }

    const block = await dynamodb.updateBlock(blockId, updates, updates.updatedBy || 'anonymous');

    if (!block) {
      return res.status(404).json({ error: 'Block not found' });
    }

    // Transform to frontend schema
    const response = {
      ...block,
      id: block.blockId,
    };

    res.json(response);
  } catch (error) {
    console.error('Error updating block:', error);
    res.status(500).json({ error: 'Failed to update block' });
  }
});

// DELETE /api/blocks/:blockId - Delete a block
router.delete('/:blockId', async (req: Request, res: Response) => {
  try {
    const { blockId } = req.params;
    const deleted = await dynamodb.deleteBlock(blockId);

    if (!deleted) {
      return res.status(404).json({ error: 'Block not found' });
    }

    res.status(204).send();
  } catch (error) {
    console.error('Error deleting block:', error);
    res.status(500).json({ error: 'Failed to delete block' });
  }
});

export default router;

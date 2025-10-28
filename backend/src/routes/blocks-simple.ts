import { Router, Request, Response } from 'express';
import * as dynamodb from '../dynamodb';
import { Block } from '../types';

const router = Router();

// GET /api/blocks?pageId=xxx - Get blocks for a page
router.get('/', async (req: Request, res: Response) => {
  try {
    const { pageId } = req.query;

    // If no pageId provided, use a default page
    const targetPageId = (pageId as string) || 'default-page';

    const blocks = await dynamodb.getPageBlocks(targetPageId);

    // Transform to match frontend expectations (blockId -> id)
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

    if (!incomingData.type) {
      return res.status(400).json({ error: 'Missing required field: type' });
    }

    // Prepare block data for DynamoDB
    const blockData: Partial<Block> = {
      type: incomingData.type,
      pageId: incomingData.pageId || 'default-page',
      order: incomingData.order || 0,
      ...incomingData
    };

    // Remove frontend 'id' field if present
    delete (blockData as any).id;

    const userId = incomingData.userId || 'anonymous';
    const block = await dynamodb.createBlock(blockData, userId);

    // Transform response to match frontend expectations
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

// PUT /api/blocks/:id - Update a block
router.put('/:id', async (req: Request, res: Response) => {
  try {
    const blockId = req.params.id;
    const { userId = 'anonymous', ...updates } = req.body;

    // Remove 'id' from updates if present
    delete (updates as any).id;

    const block = await dynamodb.updateBlock(blockId, updates, userId);

    if (!block) {
      return res.status(404).json({ error: 'Block not found' });
    }

    // Transform response
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

// DELETE /api/blocks/:id - Delete a block
router.delete('/:id', async (req: Request, res: Response) => {
  try {
    const blockId = req.params.id;

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

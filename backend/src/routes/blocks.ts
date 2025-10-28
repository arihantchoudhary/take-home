import { Router, Request, Response } from 'express';
import * as db from '../database';
import { Block } from '../types';

const router = Router();

// GET /api/blocks - Get all blocks
router.get('/', async (req: Request, res: Response) => {
  try {
    const blocks = await db.getAllBlocks();
    res.json(blocks);
  } catch (error) {
    console.error('Error fetching blocks:', error);
    res.status(500).json({ error: 'Failed to fetch blocks' });
  }
});

// POST /api/blocks - Create a new block
router.post('/', async (req: Request, res: Response) => {
  try {
    const blockData: Block = req.body;

    if (!blockData.pageId || !blockData.type) {
      return res.status(400).json({ error: 'Missing required fields: pageId, type' });
    }

    const block = await db.createBlock(blockData);
    res.status(201).json(block);
  } catch (error) {
    console.error('Error creating block:', error);
    res.status(500).json({ error: 'Failed to create block' });
  }
});

// GET /api/blocks/:blockId - Get a block
router.get('/:blockId', async (req: Request, res: Response) => {
  try {
    const { blockId } = req.params;
    const block = await db.getBlockById(blockId);

    if (!block) {
      return res.status(404).json({ error: 'Block not found' });
    }

    res.json(block);
  } catch (error) {
    console.error('Error fetching block:', error);
    res.status(500).json({ error: 'Failed to fetch block' });
  }
});

// PUT /api/blocks/:blockId - Update a block
router.put('/:blockId', async (req: Request, res: Response) => {
  try {
    const { blockId } = req.params;
    const updates: Partial<Block> = req.body;

    const block = await db.updateBlock(blockId, updates);

    if (!block) {
      return res.status(404).json({ error: 'Block not found' });
    }

    res.json(block);
  } catch (error) {
    console.error('Error updating block:', error);
    res.status(500).json({ error: 'Failed to update block' });
  }
});

// DELETE /api/blocks/:blockId - Delete a block
router.delete('/:blockId', async (req: Request, res: Response) => {
  try {
    const { blockId } = req.params;
    const deleted = await db.deleteBlock(blockId);

    if (!deleted) {
      return res.status(404).json({ error: 'Block not found' });
    }

    res.status(204).send();
  } catch (error) {
    console.error('Error deleting block:', error);
    res.status(500).json({ error: 'Failed to delete block' });
  }
});

// GET /api/blocks/:blockId/comments - Get block comments
router.get('/:blockId/comments', async (req: Request, res: Response) => {
  try {
    const { blockId } = req.params;
    const comments = await db.getBlockComments(blockId);
    res.json(comments);
  } catch (error) {
    console.error('Error fetching block comments:', error);
    res.status(500).json({ error: 'Failed to fetch block comments' });
  }
});

export default router;

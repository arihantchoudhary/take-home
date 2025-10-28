import express, { Request, Response } from 'express';
import cors from 'cors';
import { Block, TextBlock, ImageBlock } from './types';
import * as db from './database';

const app = express();
const PORT = process.env.PORT || 3001;

// Middleware
app.use(cors());
app.use(express.json());

// GET /api/blocks - Get all blocks
app.get('/api/blocks', async (req: Request, res: Response) => {
  try {
    const blocks = await db.getAllBlocks();
    res.json(blocks);
  } catch (error) {
    console.error('Error fetching blocks:', error);
    res.status(500).json({ error: 'Failed to fetch blocks' });
  }
});

// GET /api/blocks/:id - Get a single block
app.get('/api/blocks/:id', async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const block = await db.getBlockById(id);

    if (!block) {
      return res.status(404).json({ error: 'Block not found' });
    }

    res.json(block);
  } catch (error) {
    console.error('Error fetching block:', error);
    res.status(500).json({ error: 'Failed to fetch block' });
  }
});

// POST /api/blocks - Create a new block
app.post('/api/blocks', async (req: Request, res: Response) => {
  try {
    const block: Block = req.body;

    // Validate block structure
    if (!block.id || !block.type) {
      return res.status(400).json({ error: 'Invalid block structure' });
    }

    // Validate text block
    if (block.type === 'text') {
      const textBlock = block as TextBlock;
      if (!textBlock.textType || textBlock.value === undefined) {
        return res.status(400).json({ error: 'Invalid text block structure' });
      }
    }

    // Validate image block
    if (block.type === 'image') {
      const imageBlock = block as ImageBlock;
      if (!imageBlock.src || !imageBlock.width || !imageBlock.height) {
        return res.status(400).json({ error: 'Invalid image block structure' });
      }
    }

    const newBlock = await db.addBlock(block);
    res.status(201).json(newBlock);
  } catch (error) {
    console.error('Error creating block:', error);
    res.status(500).json({ error: 'Failed to create block' });
  }
});

// PUT /api/blocks/:id - Update a block
app.put('/api/blocks/:id', async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const block: Block = req.body;

    const updatedBlock = await db.updateBlock(id, block);

    if (!updatedBlock) {
      return res.status(404).json({ error: 'Block not found' });
    }

    res.json(updatedBlock);
  } catch (error) {
    console.error('Error updating block:', error);
    res.status(500).json({ error: 'Failed to update block' });
  }
});

// DELETE /api/blocks/:id - Delete a block
app.delete('/api/blocks/:id', async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const deleted = await db.deleteBlock(id);

    if (!deleted) {
      return res.status(404).json({ error: 'Block not found' });
    }

    res.status(204).send();
  } catch (error) {
    console.error('Error deleting block:', error);
    res.status(500).json({ error: 'Failed to delete block' });
  }
});

// Health check endpoint
app.get('/health', (req: Request, res: Response) => {
  res.json({ status: 'ok' });
});

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});

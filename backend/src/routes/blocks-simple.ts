import { Router, Request, Response } from 'express';
import fs from 'fs/promises';
import path from 'path';

const router = Router();
const BLOCKS_FILE = path.join(__dirname, '../../data/blocks.json');

// Ensure data directory exists
async function ensureDataDir() {
  const dir = path.dirname(BLOCKS_FILE);
  await fs.mkdir(dir, { recursive: true });
}

// Read blocks from file
async function readBlocks() {
  try {
    await ensureDataDir();
    const data = await fs.readFile(BLOCKS_FILE, 'utf-8');
    const parsed = JSON.parse(data);
    // Return array directly, or empty array if not an array
    return Array.isArray(parsed) ? parsed : [];
  } catch (error) {
    // If file doesn't exist, return empty array
    return [];
  }
}

// Write blocks to file
async function writeBlocks(blocks: any[]) {
  await ensureDataDir();
  await fs.writeFile(BLOCKS_FILE, JSON.stringify(blocks, null, 2));
}

// GET /api/blocks - Get all blocks
router.get('/', async (req: Request, res: Response) => {
  try {
    const blocks = await readBlocks();
    res.json(blocks);
  } catch (error) {
    console.error('Error fetching blocks:', error);
    res.status(500).json({ error: 'Failed to fetch blocks' });
  }
});

// POST /api/blocks - Create a new block
router.post('/', async (req: Request, res: Response) => {
  try {
    const newBlock = req.body;

    if (!newBlock.type) {
      return res.status(400).json({ error: 'Missing required field: type' });
    }

    const blocks = await readBlocks();
    blocks.push(newBlock);
    await writeBlocks(blocks);

    res.status(201).json(newBlock);
  } catch (error) {
    console.error('Error creating block:', error);
    res.status(500).json({ error: 'Failed to create block' });
  }
});

// PUT /api/blocks/:id - Update a block
router.put('/:id', async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const updates = req.body;

    const blocks = await readBlocks();
    const index = blocks.findIndex((b: any) => b.id === id);

    if (index === -1) {
      return res.status(404).json({ error: 'Block not found' });
    }

    blocks[index] = { ...blocks[index], ...updates, id };
    await writeBlocks(blocks);

    res.json(blocks[index]);
  } catch (error) {
    console.error('Error updating block:', error);
    res.status(500).json({ error: 'Failed to update block' });
  }
});

// DELETE /api/blocks/:id - Delete a block
router.delete('/:id', async (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    const blocks = await readBlocks();
    const filteredBlocks = blocks.filter((b: any) => b.id !== id);

    if (filteredBlocks.length === blocks.length) {
      return res.status(404).json({ error: 'Block not found' });
    }

    await writeBlocks(filteredBlocks);
    res.status(204).send();
  } catch (error) {
    console.error('Error deleting block:', error);
    res.status(500).json({ error: 'Failed to delete block' });
  }
});

export default router;

import express, { Request, Response } from 'express';
import cors from 'cors';
import * as db from './dynamodb';
import { Block } from './types';

const app = express();
const PORT = process.env.PORT || 3001;

// Middleware
app.use(cors());
app.use(express.json());

// Request logging middleware
app.use((req, res, next) => {
  console.log(`${new Date().toISOString()} - ${req.method} ${req.path}`);
  next();
});

// GET /api/pages/:pageId/blocks - Get all blocks for a page
app.get('/api/pages/:pageId/blocks', async (req: Request, res: Response) => {
  try {
    const blocks = await db.getPageBlocks(req.params.pageId);
    res.json(blocks);
  } catch (error) {
    console.error('Error fetching blocks:', error);
    res.status(500).json({ error: 'Failed to fetch blocks' });
  }
});

// GET /api/blocks/:id - Get a single block
app.get('/api/blocks/:id', async (req: Request, res: Response) => {
  try {
    const block = await db.getBlock(req.params.id);
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
    const { userId = 'default-user', ...blockData } = req.body;
    const newBlock = await db.createBlock(blockData, userId);
    res.status(201).json(newBlock);
  } catch (error) {
    console.error('Error creating block:', error);
    res.status(500).json({ error: 'Failed to create block' });
  }
});

// PUT /api/blocks/:id - Update a block
app.put('/api/blocks/:id', async (req: Request, res: Response) => {
  try {
    const { userId = 'default-user', ...updates } = req.body;
    const updatedBlock = await db.updateBlock(req.params.id, updates, userId);
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
    const deleted = await db.deleteBlock(req.params.id);
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
  res.json({
    status: 'ok',
    timestamp: new Date().toISOString(),
    service: 'notion-clone-api'
  });
});

// Root endpoint
app.get('/', (req: Request, res: Response) => {
  res.json({
    message: 'Simple Notion Clone API',
    version: '1.0.0',
    endpoints: {
      blocks: '/api/blocks',
      health: '/health'
    }
  });
});

// Start server
app.listen(PORT, () => {
  console.log('\n' + '='.repeat(55));
  console.log('🚀 Simple Notion Clone API Server');
  console.log('='.repeat(55));
  console.log(`Server: http://localhost:${PORT}`);
  console.log(`Health: http://localhost:${PORT}/health`);
  console.log(`Blocks: http://localhost:${PORT}/api/blocks`);
  console.log('='.repeat(55) + '\n');
});

import { Router, Request, Response } from 'express';
import * as db from '../dynamodb';
import { CreatePageRequest, UpdatePageRequest } from '../types';

const router = Router();

// POST /api/pages - Create a new page
router.post('/', async (req: Request, res: Response) => {
  try {
    const pageData: CreatePageRequest = req.body;
    const userId = req.body.userId || 'default-user'; // In production, get from auth

    if (!pageData.workspaceId || !pageData.title) {
      return res.status(400).json({ error: 'Missing required fields: workspaceId, title' });
    }

    const page = await db.createPage(pageData, userId);
    res.status(201).json(page);
  } catch (error) {
    console.error('Error creating page:', error);
    res.status(500).json({ error: 'Failed to create page' });
  }
});

// GET /api/pages/:pageId - Get a page
router.get('/:pageId', async (req: Request, res: Response) => {
  try {
    const { pageId } = req.params;
    const page = await db.getPage(pageId);

    if (!page) {
      return res.status(404).json({ error: 'Page not found' });
    }

    res.json(page);
  } catch (error) {
    console.error('Error fetching page:', error);
    res.status(500).json({ error: 'Failed to fetch page' });
  }
});

// PUT /api/pages/:pageId - Update a page
router.put('/:pageId', async (req: Request, res: Response) => {
  try {
    const { pageId } = req.params;
    const updates: UpdatePageRequest = req.body;
    const userId = req.body.userId || 'default-user';

    const page = await db.updatePage(pageId, updates, userId);

    if (!page) {
      return res.status(404).json({ error: 'Page not found' });
    }

    res.json(page);
  } catch (error) {
    console.error('Error updating page:', error);
    res.status(500).json({ error: 'Failed to update page' });
  }
});

// DELETE /api/pages/:pageId - Delete a page
router.delete('/:pageId', async (req: Request, res: Response) => {
  try {
    const { pageId } = req.params;
    const deleted = await db.deletePage(pageId);

    if (!deleted) {
      return res.status(404).json({ error: 'Page not found' });
    }

    res.status(204).send();
  } catch (error) {
    console.error('Error deleting page:', error);
    res.status(500).json({ error: 'Failed to delete page' });
  }
});

// GET /api/pages/:pageId/children - Get child pages
router.get('/:pageId/children', async (req: Request, res: Response) => {
  try {
    const { pageId } = req.params;
    const childPages = await db.getChildPages(pageId);
    res.json(childPages);
  } catch (error) {
    console.error('Error fetching child pages:', error);
    res.status(500).json({ error: 'Failed to fetch child pages' });
  }
});

// GET /api/pages/:pageId/blocks - Get page blocks
router.get('/:pageId/blocks', async (req: Request, res: Response) => {
  try {
    const { pageId } = req.params;
    const blocks = await db.getPageBlocks(pageId);
    res.json(blocks);
  } catch (error) {
    console.error('Error fetching page blocks:', error);
    res.status(500).json({ error: 'Failed to fetch page blocks' });
  }
});

// GET /api/workspaces/:workspaceId/pages - Get all pages in workspace
router.get('/workspace/:workspaceId', async (req: Request, res: Response) => {
  try {
    const { workspaceId } = req.params;
    const pages = await db.getWorkspacePages(workspaceId);
    res.json(pages);
  } catch (error) {
    console.error('Error fetching workspace pages:', error);
    res.status(500).json({ error: 'Failed to fetch workspace pages' });
  }
});

// POST /api/pages/:pageId/share - Share a page with a user
router.post('/:pageId/share', async (req: Request, res: Response) => {
  try {
    const { pageId } = req.params;
    const { userId, permission } = req.body;
    const sharedBy = req.body.sharedBy || 'default-user';

    if (!userId || !permission) {
      return res.status(400).json({ error: 'Missing required fields: userId, permission' });
    }

    const share = await db.sharePage(pageId, userId, permission, sharedBy);
    res.status(201).json(share);
  } catch (error) {
    console.error('Error sharing page:', error);
    res.status(500).json({ error: 'Failed to share page' });
  }
});

// GET /api/pages/:pageId/shares - Get page shares
router.get('/:pageId/shares', async (req: Request, res: Response) => {
  try {
    const { pageId } = req.params;
    const shares = await db.getPageShares(pageId);
    res.json(shares);
  } catch (error) {
    console.error('Error fetching page shares:', error);
    res.status(500).json({ error: 'Failed to fetch page shares' });
  }
});

export default router;

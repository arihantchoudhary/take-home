import { Router, Request, Response } from 'express';
import * as db from '../dynamodb';
import { SearchRequest } from '../types';

const router = Router();

// POST /api/search - Search pages and blocks
router.post('/', async (req: Request, res: Response) => {
  try {
    const searchRequest: SearchRequest = req.body;

    if (!searchRequest.query || !searchRequest.workspaceId) {
      return res.status(400).json({ error: 'Missing required fields: query, workspaceId' });
    }

    const results = await db.searchPages(searchRequest);
    res.json(results);
  } catch (error) {
    console.error('Error searching:', error);
    res.status(500).json({ error: 'Failed to search' });
  }
});

export default router;

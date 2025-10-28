import { Router, Request, Response } from 'express';
import * as db from '../dynamodb';
import { CreateCommentRequest } from '../types';

const router = Router();

// POST /api/comments - Create a new comment
router.post('/', async (req: Request, res: Response) => {
  try {
    const commentData: CreateCommentRequest = req.body;
    const userId = req.body.userId || 'default-user';

    if (!commentData.pageId || !commentData.content) {
      return res.status(400).json({ error: 'Missing required fields: pageId, content' });
    }

    const comment = await db.createComment(commentData, userId);
    res.status(201).json(comment);
  } catch (error) {
    console.error('Error creating comment:', error);
    res.status(500).json({ error: 'Failed to create comment' });
  }
});

// GET /api/comments/page/:pageId - Get page comments
router.get('/page/:pageId', async (req: Request, res: Response) => {
  try {
    const { pageId } = req.params;
    const comments = await db.getPageComments(pageId);
    res.json(comments);
  } catch (error) {
    console.error('Error fetching page comments:', error);
    res.status(500).json({ error: 'Failed to fetch page comments' });
  }
});

// PUT /api/comments/:commentId/resolve - Resolve a comment
router.put('/:commentId/resolve', async (req: Request, res: Response) => {
  try {
    const { commentId } = req.params;
    const comment = await db.resolveComment(commentId);

    if (!comment) {
      return res.status(404).json({ error: 'Comment not found' });
    }

    res.json(comment);
  } catch (error) {
    console.error('Error resolving comment:', error);
    res.status(500).json({ error: 'Failed to resolve comment' });
  }
});

export default router;

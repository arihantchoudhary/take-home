import { Router, Request, Response } from 'express';
import * as db from '../dynamodb';

const router = Router();

// GET /api/favorites/:userId - Get user's favorites
router.get('/:userId', async (req: Request, res: Response) => {
  try {
    const { userId } = req.params;
    const favorites = await db.getUserFavorites(userId);
    res.json(favorites);
  } catch (error) {
    console.error('Error fetching favorites:', error);
    res.status(500).json({ error: 'Failed to fetch favorites' });
  }
});

// POST /api/favorites - Add a favorite
router.post('/', async (req: Request, res: Response) => {
  try {
    const { userId, pageId } = req.body;

    if (!userId || !pageId) {
      return res.status(400).json({ error: 'Missing required fields: userId, pageId' });
    }

    const favorite = await db.addFavorite(userId, pageId);
    res.status(201).json(favorite);
  } catch (error) {
    console.error('Error adding favorite:', error);
    res.status(500).json({ error: 'Failed to add favorite' });
  }
});

// DELETE /api/favorites/:userId/:pageId - Remove a favorite
router.delete('/:userId/:pageId', async (req: Request, res: Response) => {
  try {
    const { userId, pageId } = req.params;
    await db.removeFavorite(userId, pageId);
    res.status(204).send();
  } catch (error) {
    console.error('Error removing favorite:', error);
    res.status(500).json({ error: 'Failed to remove favorite' });
  }
});

export default router;

import { Router, Request, Response } from 'express';
import * as db from '../database';

const router = Router();

// POST /api/users - Create a new user
router.post('/', async (req: Request, res: Response) => {
  try {
    const { email, name } = req.body;

    if (!email || !name) {
      return res.status(400).json({ error: 'Missing required fields: email, name' });
    }

    // Check if user already exists
    const existingUser = await db.getUserByEmail(email);
    if (existingUser) {
      return res.status(409).json({ error: 'User with this email already exists' });
    }

    const user = await db.createUser(email, name);
    res.status(201).json(user);
  } catch (error) {
    console.error('Error creating user:', error);
    res.status(500).json({ error: 'Failed to create user' });
  }
});

// GET /api/users/:userId - Get a user
router.get('/:userId', async (req: Request, res: Response) => {
  try {
    const { userId } = req.params;
    const user = await db.getUser(userId);

    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    res.json(user);
  } catch (error) {
    console.error('Error fetching user:', error);
    res.status(500).json({ error: 'Failed to fetch user' });
  }
});

// GET /api/users/email/:email - Get a user by email
router.get('/email/:email', async (req: Request, res: Response) => {
  try {
    const { email } = req.params;
    const user = await db.getUserByEmail(email);

    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    res.json(user);
  } catch (error) {
    console.error('Error fetching user by email:', error);
    res.status(500).json({ error: 'Failed to fetch user by email' });
  }
});

// GET /api/users/:userId/workspaces - Get user's workspaces
router.get('/:userId/workspaces', async (req: Request, res: Response) => {
  try {
    const { userId } = req.params;
    const workspaces = await db.getUserWorkspaces(userId);
    res.json(workspaces);
  } catch (error) {
    console.error('Error fetching user workspaces:', error);
    res.status(500).json({ error: 'Failed to fetch user workspaces' });
  }
});

export default router;

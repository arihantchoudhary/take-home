import { Router, Request, Response } from 'express';
import * as db from '../database';

const router = Router();

// POST /api/workspaces - Create a new workspace
router.post('/', async (req: Request, res: Response) => {
  try {
    const { name, ownerId } = req.body;

    if (!name || !ownerId) {
      return res.status(400).json({ error: 'Missing required fields: name, ownerId' });
    }

    const workspace = await db.createWorkspace(name, ownerId);
    res.status(201).json(workspace);
  } catch (error) {
    console.error('Error creating workspace:', error);
    res.status(500).json({ error: 'Failed to create workspace' });
  }
});

// GET /api/workspaces/:workspaceId - Get a workspace
router.get('/:workspaceId', async (req: Request, res: Response) => {
  try {
    const { workspaceId } = req.params;
    const workspace = await db.getWorkspace(workspaceId);

    if (!workspace) {
      return res.status(404).json({ error: 'Workspace not found' });
    }

    res.json(workspace);
  } catch (error) {
    console.error('Error fetching workspace:', error);
    res.status(500).json({ error: 'Failed to fetch workspace' });
  }
});

// PUT /api/workspaces/:workspaceId - Update a workspace
router.put('/:workspaceId', async (req: Request, res: Response) => {
  try {
    const { workspaceId } = req.params;
    const updates = req.body;

    const workspace = await db.updateWorkspace(workspaceId, updates);

    if (!workspace) {
      return res.status(404).json({ error: 'Workspace not found' });
    }

    res.json(workspace);
  } catch (error) {
    console.error('Error updating workspace:', error);
    res.status(500).json({ error: 'Failed to update workspace' });
  }
});

// GET /api/workspaces/:workspaceId/members - Get workspace members
router.get('/:workspaceId/members', async (req: Request, res: Response) => {
  try {
    const { workspaceId } = req.params;
    const members = await db.getWorkspaceMembers(workspaceId);
    res.json(members);
  } catch (error) {
    console.error('Error fetching workspace members:', error);
    res.status(500).json({ error: 'Failed to fetch workspace members' });
  }
});

// POST /api/workspaces/:workspaceId/members - Add a workspace member
router.post('/:workspaceId/members', async (req: Request, res: Response) => {
  try {
    const { workspaceId } = req.params;
    const { userId, role } = req.body;

    if (!userId || !role) {
      return res.status(400).json({ error: 'Missing required fields: userId, role' });
    }

    const member = await db.addWorkspaceMember(workspaceId, userId, role);
    res.status(201).json(member);
  } catch (error) {
    console.error('Error adding workspace member:', error);
    res.status(500).json({ error: 'Failed to add workspace member' });
  }
});

export default router;

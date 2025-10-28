import { Router, Request, Response } from 'express';
import * as db from '../dynamodb';

const router = Router();

// GET /api/notifications/:userId - Get user notifications
router.get('/:userId', async (req: Request, res: Response) => {
  try {
    const { userId } = req.params;
    const notifications = await db.getUserNotifications(userId);
    res.json(notifications);
  } catch (error) {
    console.error('Error fetching notifications:', error);
    res.status(500).json({ error: 'Failed to fetch notifications' });
  }
});

// PUT /api/notifications/:notificationId/read - Mark notification as read
router.put('/:notificationId/read', async (req: Request, res: Response) => {
  try {
    const { notificationId } = req.params;
    const notification = await db.markNotificationRead(notificationId);

    if (!notification) {
      return res.status(404).json({ error: 'Notification not found' });
    }

    res.json(notification);
  } catch (error) {
    console.error('Error marking notification as read:', error);
    res.status(500).json({ error: 'Failed to mark notification as read' });
  }
});

export default router;

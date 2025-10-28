import { Router, Request, Response } from 'express';
import * as db from '../dynamodb';
import { Template } from '../types';

const router = Router();

// GET /api/templates - Get all templates or by category
router.get('/', async (req: Request, res: Response) => {
  try {
    const { category } = req.query;
    const templates = await db.getTemplates(category as string);
    res.json(templates);
  } catch (error) {
    console.error('Error fetching templates:', error);
    res.status(500).json({ error: 'Failed to fetch templates' });
  }
});

// POST /api/templates - Create a new template
router.post('/', async (req: Request, res: Response) => {
  try {
    const templateData: Omit<Template, 'templateId' | 'createdAt'> = req.body;

    if (!templateData.name || !templateData.category) {
      return res.status(400).json({ error: 'Missing required fields: name, category' });
    }

    const template = await db.createTemplate(templateData);
    res.status(201).json(template);
  } catch (error) {
    console.error('Error creating template:', error);
    res.status(500).json({ error: 'Failed to create template' });
  }
});

export default router;

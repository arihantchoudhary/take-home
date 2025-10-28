import { Router, Request, Response } from 'express';
import fs from 'fs/promises';
import path from 'path';

const router = Router();

const DATA_DIR = path.join(__dirname, '../../data');
const PAGE_FILE = path.join(DATA_DIR, 'page-metadata.json');

interface PageMetadata {
  pageId: string;
  title: string;
  icon: string;
  coverImage: string | null;
}

// Ensure data directory and file exist
async function ensureDataFile() {
  try {
    await fs.mkdir(DATA_DIR, { recursive: true });
    try {
      await fs.access(PAGE_FILE);
    } catch {
      // Create default page metadata
      const defaultData: PageMetadata = {
        pageId: 'default-page',
        title: 'Untitled',
        icon: '📄',
        coverImage: null,
      };
      await fs.writeFile(PAGE_FILE, JSON.stringify(defaultData, null, 2));
    }
  } catch (error) {
    console.error('Error ensuring page metadata file:', error);
  }
}

// Read page metadata
async function readPageMetadata(): Promise<PageMetadata> {
  await ensureDataFile();
  try {
    const data = await fs.readFile(PAGE_FILE, 'utf-8');
    return JSON.parse(data);
  } catch (error) {
    console.error('Error reading page metadata:', error);
    return {
      pageId: 'default-page',
      title: 'Untitled',
      icon: '📄',
      coverImage: null,
    };
  }
}

// Write page metadata
async function writePageMetadata(metadata: PageMetadata): Promise<void> {
  await fs.mkdir(DATA_DIR, { recursive: true });
  await fs.writeFile(PAGE_FILE, JSON.stringify(metadata, null, 2));
}

// GET /api/pages/default - Get the default page metadata
router.get('/default', async (req: Request, res: Response) => {
  try {
    const metadata = await readPageMetadata();
    res.json(metadata);
  } catch (error) {
    console.error('Error fetching page metadata:', error);
    res.status(500).json({ error: 'Failed to fetch page metadata' });
  }
});

// PUT /api/pages/default - Update the default page metadata
router.put('/default', async (req: Request, res: Response) => {
  try {
    const currentMetadata = await readPageMetadata();
    const updates = req.body;

    const updatedMetadata: PageMetadata = {
      pageId: currentMetadata.pageId,
      title: updates.title !== undefined ? updates.title : currentMetadata.title,
      icon: updates.icon !== undefined ? updates.icon : currentMetadata.icon,
      coverImage: updates.coverImage !== undefined ? updates.coverImage : currentMetadata.coverImage,
    };

    await writePageMetadata(updatedMetadata);
    console.log('Updated page metadata:', updatedMetadata);
    res.json(updatedMetadata);
  } catch (error) {
    console.error('Error updating page metadata:', error);
    res.status(500).json({ error: 'Failed to update page metadata' });
  }
});

export default router;

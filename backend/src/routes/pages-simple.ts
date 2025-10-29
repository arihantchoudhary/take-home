import { Router, Request, Response } from 'express';
import * as dynamodb from '../dynamodb';
import { uploadImageToS3, isBase64Image, getContentTypeFromDataUri } from '../s3';

const router = Router();

interface PageMetadata {
  pageId: string;
  title: string;
  icon: string;
  coverImage: string | null;
}

// Get or create default page in DynamoDB
async function getDefaultPage(): Promise<PageMetadata> {
  try {
    let page = await dynamodb.getPage('default-page');

    if (!page) {
      // Create default page if it doesn't exist
      const defaultPageData = {
        workspaceId: 'default-workspace',
        title: 'Untitled',
        icon: '📄',
        isPrivate: false,
      };

      // First create workspace if needed
      const workspace = await dynamodb.getWorkspace('default-workspace');
      if (!workspace) {
        await dynamodb.createWorkspace('Default Workspace', 'anonymous');
      }

      page = await dynamodb.createPage(defaultPageData, 'anonymous');
    }

    return {
      pageId: page.pageId,
      title: page.title,
      icon: page.icon || '📄',
      coverImage: page.coverImage || null,
    };
  } catch (error) {
    console.error('Error getting default page:', error);
    // Return fallback data
    return {
      pageId: 'default-page',
      title: 'Untitled',
      icon: '📄',
      coverImage: null,
    };
  }
}

// GET /api/pages/default - Get the default page metadata
router.get('/default', async (req: Request, res: Response) => {
  try {
    const metadata = await getDefaultPage();
    res.json(metadata);
  } catch (error) {
    console.error('Error fetching page metadata:', error);
    res.status(500).json({ error: 'Failed to fetch page metadata' });
  }
});

// PUT /api/pages/default - Update the default page metadata
router.put('/default', async (req: Request, res: Response) => {
  try {
    const updates = req.body;

    // If coverImage is a base64 image, upload to S3 first
    if (updates.coverImage && isBase64Image(updates.coverImage)) {
      console.log('[PAGES] Detected base64 cover image, uploading to S3...');
      const contentType = getContentTypeFromDataUri(updates.coverImage);
      const s3Url = await uploadImageToS3(updates.coverImage, contentType);
      console.log('[PAGES] Cover image uploaded to S3:', s3Url);
      updates.coverImage = s3Url;
    }

    // Update the page in DynamoDB
    const updatedPage = await dynamodb.updatePage(
      'default-page',
      {
        title: updates.title,
        icon: updates.icon,
        coverImage: updates.coverImage,
      },
      'anonymous'
    );

    if (!updatedPage) {
      return res.status(404).json({ error: 'Page not found' });
    }

    const response: PageMetadata = {
      pageId: updatedPage.pageId,
      title: updatedPage.title,
      icon: updatedPage.icon || '📄',
      coverImage: updatedPage.coverImage || null,
    };

    console.log('Updated page metadata:', response);
    res.json(response);
  } catch (error) {
    console.error('Error updating page metadata:', error);
    res.status(500).json({ error: 'Failed to update page metadata' });
  }
});

export default router;

import { DynamoDBClient } from '@aws-sdk/client-dynamodb';
import {
  DynamoDBDocumentClient,
  GetCommand,
  PutCommand,
  UpdateCommand,
  DeleteCommand,
  QueryCommand,
  ScanCommand
} from '@aws-sdk/lib-dynamodb';
import { v4 as uuidv4 } from 'uuid';
import * as types from './types';

// Initialize DynamoDB client
const client = new DynamoDBClient({
  region: process.env.AWS_REGION || 'us-east-1',
  ...(process.env.DYNAMODB_ENDPOINT && { endpoint: process.env.DYNAMODB_ENDPOINT })
});

const docClient = DynamoDBDocumentClient.from(client);

const TABLES = {
  WORKSPACES: process.env.WORKSPACES_TABLE || 'dev-notion-workspaces',
  PAGES: process.env.PAGES_TABLE || 'dev-notion-pages',
  BLOCKS: process.env.BLOCKS_TABLE || 'dev-notion-blocks',
  USERS: process.env.USERS_TABLE || 'dev-notion-users',
  WORKSPACE_MEMBERS: process.env.WORKSPACE_MEMBERS_TABLE || 'dev-notion-workspace-members',
  PAGE_SHARES: process.env.PAGE_SHARES_TABLE || 'dev-notion-page-shares',
  COMMENTS: process.env.COMMENTS_TABLE || 'dev-notion-comments',
  NOTIFICATIONS: process.env.NOTIFICATIONS_TABLE || 'dev-notion-notifications',
  FAVORITES: process.env.FAVORITES_TABLE || 'dev-notion-favorites',
  TEMPLATES: process.env.TEMPLATES_TABLE || 'dev-notion-templates',
};

// ============= Workspace Operations =============

export async function createWorkspace(name: string, ownerId: string): Promise<types.Workspace> {
  const workspace: types.Workspace = {
    workspaceId: uuidv4(),
    name,
    ownerId,
    createdAt: Date.now(),
    updatedAt: Date.now(),
  };

  await docClient.send(new PutCommand({
    TableName: TABLES.WORKSPACES,
    Item: workspace,
  }));

  // Add owner as workspace member
  await addWorkspaceMember(workspace.workspaceId, ownerId, 'owner');

  return workspace;
}

export async function getWorkspace(workspaceId: string): Promise<types.Workspace | null> {
  const result = await docClient.send(new GetCommand({
    TableName: TABLES.WORKSPACES,
    Key: { workspaceId },
  }));
  return result.Item as types.Workspace || null;
}

export async function updateWorkspace(workspaceId: string, updates: Partial<types.Workspace>): Promise<types.Workspace | null> {
  const workspace = await getWorkspace(workspaceId);
  if (!workspace) return null;

  const updatedWorkspace = { ...workspace, ...updates, updatedAt: Date.now() };
  await docClient.send(new PutCommand({
    TableName: TABLES.WORKSPACES,
    Item: updatedWorkspace,
  }));

  return updatedWorkspace;
}

// ============= Workspace Member Operations =============

export async function addWorkspaceMember(workspaceId: string, userId: string, role: 'owner' | 'admin' | 'member'): Promise<types.WorkspaceMember> {
  const member: types.WorkspaceMember = {
    workspaceId,
    userId,
    role,
    joinedAt: Date.now(),
  };

  await docClient.send(new PutCommand({
    TableName: TABLES.WORKSPACE_MEMBERS,
    Item: member,
  }));

  return member;
}

export async function getWorkspaceMembers(workspaceId: string): Promise<types.WorkspaceMember[]> {
  const result = await docClient.send(new QueryCommand({
    TableName: TABLES.WORKSPACE_MEMBERS,
    KeyConditionExpression: 'workspaceId = :workspaceId',
    ExpressionAttributeValues: { ':workspaceId': workspaceId },
  }));

  return result.Items as types.WorkspaceMember[] || [];
}

export async function getUserWorkspaces(userId: string): Promise<types.WorkspaceMember[]> {
  const result = await docClient.send(new QueryCommand({
    TableName: TABLES.WORKSPACE_MEMBERS,
    IndexName: 'UserIndex',
    KeyConditionExpression: 'userId = :userId',
    ExpressionAttributeValues: { ':userId': userId },
  }));

  return result.Items as types.WorkspaceMember[] || [];
}

// ============= Page Operations =============

export async function createPage(data: types.CreatePageRequest, userId: string): Promise<types.Page> {
  const page: types.Page = {
    pageId: uuidv4(),
    workspaceId: data.workspaceId,
    title: data.title,
    icon: data.icon,
    coverImage: data.coverImage,
    parentPageId: data.parentPageId,
    order: 0,
    isPrivate: data.isPrivate || false,
    createdAt: Date.now(),
    updatedAt: Date.now(),
    createdBy: userId,
    lastEditedBy: userId,
  };

  await docClient.send(new PutCommand({
    TableName: TABLES.PAGES,
    Item: page,
  }));

  return page;
}

export async function getPage(pageId: string): Promise<types.Page | null> {
  const result = await docClient.send(new GetCommand({
    TableName: TABLES.PAGES,
    Key: { pageId },
  }));
  return result.Item as types.Page || null;
}

export async function getWorkspacePages(workspaceId: string): Promise<types.Page[]> {
  const result = await docClient.send(new QueryCommand({
    TableName: TABLES.PAGES,
    IndexName: 'WorkspaceIndex',
    KeyConditionExpression: 'workspaceId = :workspaceId',
    ExpressionAttributeValues: { ':workspaceId': workspaceId },
  }));

  return result.Items as types.Page[] || [];
}

export async function getChildPages(parentPageId: string): Promise<types.Page[]> {
  const result = await docClient.send(new QueryCommand({
    TableName: TABLES.PAGES,
    IndexName: 'ParentPageIndex',
    KeyConditionExpression: 'parentPageId = :parentPageId',
    ExpressionAttributeValues: { ':parentPageId': parentPageId },
  }));

  return result.Items as types.Page[] || [];
}

export async function updatePage(pageId: string, updates: types.UpdatePageRequest, userId: string): Promise<types.Page | null> {
  const page = await getPage(pageId);
  if (!page) return null;

  const updatedPage = {
    ...page,
    ...updates,
    updatedAt: Date.now(),
    lastEditedBy: userId,
  };

  await docClient.send(new PutCommand({
    TableName: TABLES.PAGES,
    Item: updatedPage,
  }));

  return updatedPage;
}

export async function deletePage(pageId: string): Promise<boolean> {
  const page = await getPage(pageId);
  if (!page) return false;

  await docClient.send(new DeleteCommand({
    TableName: TABLES.PAGES,
    Key: { pageId },
  }));

  // Also delete all blocks in the page
  const blocks = await getPageBlocks(pageId);
  for (const block of blocks) {
    await deleteBlock(block.blockId);
  }

  return true;
}

// ============= Block Operations =============

export async function createBlock(data: Partial<types.Block>, userId: string): Promise<types.Block> {
  const baseBlock = {
    blockId: uuidv4(),
    createdAt: Date.now(),
    updatedAt: Date.now(),
    createdBy: userId,
    ...data,
  } as types.Block;

  await docClient.send(new PutCommand({
    TableName: TABLES.BLOCKS,
    Item: baseBlock,
  }));

  return baseBlock;
}

export async function getBlock(blockId: string): Promise<types.Block | null> {
  const result = await docClient.send(new GetCommand({
    TableName: TABLES.BLOCKS,
    Key: { blockId },
  }));
  return result.Item as types.Block || null;
}

export async function getPageBlocks(pageId: string): Promise<types.Block[]> {
  const result = await docClient.send(new QueryCommand({
    TableName: TABLES.BLOCKS,
    IndexName: 'PageIndex',
    KeyConditionExpression: 'pageId = :pageId',
    ExpressionAttributeValues: { ':pageId': pageId },
  }));

  const blocks = result.Items as types.Block[] || [];
  return blocks.sort((a, b) => a.order - b.order);
}

export async function updateBlock(blockId: string, updates: Partial<types.Block>, userId: string): Promise<types.Block | null> {
  const block = await getBlock(blockId);
  if (!block) return null;

  const updatedBlock = {
    ...block,
    ...updates,
    blockId, // ensure ID doesn't change
    updatedAt: Date.now(),
  };

  await docClient.send(new PutCommand({
    TableName: TABLES.BLOCKS,
    Item: updatedBlock,
  }));

  return updatedBlock;
}

export async function deleteBlock(blockId: string): Promise<boolean> {
  const block = await getBlock(blockId);
  if (!block) return false;

  await docClient.send(new DeleteCommand({
    TableName: TABLES.BLOCKS,
    Key: { blockId },
  }));

  return true;
}

// ============= User Operations =============

export async function createUser(email: string, name: string): Promise<types.User> {
  const user: types.User = {
    userId: uuidv4(),
    email,
    name,
    createdAt: Date.now(),
    updatedAt: Date.now(),
  };

  await docClient.send(new PutCommand({
    TableName: TABLES.USERS,
    Item: user,
  }));

  return user;
}

export async function getUser(userId: string): Promise<types.User | null> {
  const result = await docClient.send(new GetCommand({
    TableName: TABLES.USERS,
    Key: { userId },
  }));
  return result.Item as types.User || null;
}

export async function getUserByEmail(email: string): Promise<types.User | null> {
  const result = await docClient.send(new QueryCommand({
    TableName: TABLES.USERS,
    IndexName: 'EmailIndex',
    KeyConditionExpression: 'email = :email',
    ExpressionAttributeValues: { ':email': email },
  }));

  const users = result.Items as types.User[] || [];
  return users[0] || null;
}

// ============= Page Share Operations =============

export async function sharePage(pageId: string, userId: string, permission: 'view' | 'comment' | 'edit', sharedBy: string): Promise<types.PageShare> {
  const share: types.PageShare = {
    pageId,
    userId,
    permission,
    sharedAt: Date.now(),
    sharedBy,
  };

  await docClient.send(new PutCommand({
    TableName: TABLES.PAGE_SHARES,
    Item: share,
  }));

  return share;
}

export async function getPageShares(pageId: string): Promise<types.PageShare[]> {
  const result = await docClient.send(new QueryCommand({
    TableName: TABLES.PAGE_SHARES,
    KeyConditionExpression: 'pageId = :pageId',
    ExpressionAttributeValues: { ':pageId': pageId },
  }));

  return result.Items as types.PageShare[] || [];
}

// ============= Comment Operations =============

export async function createComment(data: types.CreateCommentRequest, userId: string): Promise<types.Comment> {
  const comment: types.Comment = {
    commentId: uuidv4(),
    pageId: data.pageId,
    blockId: data.blockId,
    content: data.content,
    mentions: data.mentions || [],
    createdBy: userId,
    createdAt: Date.now(),
    updatedAt: Date.now(),
    resolved: false,
    parentCommentId: data.parentCommentId,
  };

  await docClient.send(new PutCommand({
    TableName: TABLES.COMMENTS,
    Item: comment,
  }));

  // Create notifications for mentions
  for (const mentionedUserId of comment.mentions) {
    await createNotification({
      userId: mentionedUserId,
      type: 'mention',
      title: 'You were mentioned',
      message: `You were mentioned in a comment`,
      pageId: data.pageId,
      commentId: comment.commentId,
      relatedUserId: userId,
    });
  }

  return comment;
}

export async function getPageComments(pageId: string): Promise<types.Comment[]> {
  const result = await docClient.send(new QueryCommand({
    TableName: TABLES.COMMENTS,
    IndexName: 'PageIndex',
    KeyConditionExpression: 'pageId = :pageId',
    ExpressionAttributeValues: { ':pageId': pageId },
  }));

  return result.Items as types.Comment[] || [];
}

export async function getBlockComments(blockId: string): Promise<types.Comment[]> {
  const result = await docClient.send(new QueryCommand({
    TableName: TABLES.COMMENTS,
    IndexName: 'BlockIndex',
    KeyConditionExpression: 'blockId = :blockId',
    ExpressionAttributeValues: { ':blockId': blockId },
  }));

  return result.Items as types.Comment[] || [];
}

export async function resolveComment(commentId: string): Promise<types.Comment | null> {
  const result = await docClient.send(new GetCommand({
    TableName: TABLES.COMMENTS,
    Key: { commentId },
  }));

  const comment = result.Item as types.Comment;
  if (!comment) return null;

  const updatedComment = { ...comment, resolved: true, updatedAt: Date.now() };
  await docClient.send(new PutCommand({
    TableName: TABLES.COMMENTS,
    Item: updatedComment,
  }));

  return updatedComment;
}

// ============= Notification Operations =============

export async function createNotification(data: Omit<types.Notification, 'notificationId' | 'read' | 'createdAt'>): Promise<types.Notification> {
  const notification: types.Notification = {
    notificationId: uuidv4(),
    read: false,
    createdAt: Date.now(),
    ...data,
  };

  await docClient.send(new PutCommand({
    TableName: TABLES.NOTIFICATIONS,
    Item: notification,
  }));

  return notification;
}

export async function getUserNotifications(userId: string): Promise<types.Notification[]> {
  const result = await docClient.send(new QueryCommand({
    TableName: TABLES.NOTIFICATIONS,
    IndexName: 'UserIndex',
    KeyConditionExpression: 'userId = :userId',
    ExpressionAttributeValues: { ':userId': userId },
    ScanIndexForward: false, // newest first
  }));

  return result.Items as types.Notification[] || [];
}

export async function markNotificationRead(notificationId: string): Promise<types.Notification | null> {
  const result = await docClient.send(new GetCommand({
    TableName: TABLES.NOTIFICATIONS,
    Key: { notificationId },
  }));

  const notification = result.Item as types.Notification;
  if (!notification) return null;

  const updatedNotification = { ...notification, read: true };
  await docClient.send(new PutCommand({
    TableName: TABLES.NOTIFICATIONS,
    Item: updatedNotification,
  }));

  return updatedNotification;
}

// ============= Favorites Operations =============

export async function addFavorite(userId: string, pageId: string): Promise<types.Favorite> {
  // Get current favorites count to determine order
  const favorites = await getUserFavorites(userId);
  const order = favorites.length;

  const favorite: types.Favorite = {
    userId,
    pageId,
    order,
    addedAt: Date.now(),
  };

  await docClient.send(new PutCommand({
    TableName: TABLES.FAVORITES,
    Item: favorite,
  }));

  return favorite;
}

export async function getUserFavorites(userId: string): Promise<types.Favorite[]> {
  const result = await docClient.send(new QueryCommand({
    TableName: TABLES.FAVORITES,
    IndexName: 'OrderIndex',
    KeyConditionExpression: 'userId = :userId',
    ExpressionAttributeValues: { ':userId': userId },
  }));

  return result.Items as types.Favorite[] || [];
}

export async function removeFavorite(userId: string, pageId: string): Promise<boolean> {
  await docClient.send(new DeleteCommand({
    TableName: TABLES.FAVORITES,
    Key: { userId, pageId },
  }));

  return true;
}

// ============= Search Operations =============

export async function searchPages(request: types.SearchRequest): Promise<types.SearchResult[]> {
  // Get all pages in workspace
  const pages = await getWorkspacePages(request.workspaceId);

  // Simple text search (in production, use Elasticsearch or similar)
  const results: types.SearchResult[] = [];
  const query = request.query.toLowerCase();

  for (const page of pages) {
    if (page.title.toLowerCase().includes(query)) {
      results.push({
        type: 'page',
        id: page.pageId,
        title: page.title,
        preview: page.title,
        pageId: page.pageId,
        highlights: [page.title],
        createdAt: page.createdAt,
        createdBy: page.createdBy,
      });
    }

    // Search blocks in page
    const blocks = await getPageBlocks(page.pageId);
    for (const block of blocks) {
      if (block.type === 'text') {
        const textBlock = block as types.TextBlock;
        if (textBlock.value.toLowerCase().includes(query)) {
          results.push({
            type: 'block',
            id: block.blockId,
            title: page.title,
            preview: textBlock.value.substring(0, 100),
            pageId: page.pageId,
            highlights: [textBlock.value],
            createdAt: block.createdAt,
            createdBy: block.createdBy,
          });
        }
      }
    }
  }

  return results;
}

// ============= Template Operations =============

export async function createTemplate(data: Omit<types.Template, 'templateId' | 'createdAt'>): Promise<types.Template> {
  const template: types.Template = {
    templateId: uuidv4(),
    createdAt: Date.now(),
    ...data,
  };

  await docClient.send(new PutCommand({
    TableName: TABLES.TEMPLATES,
    Item: template,
  }));

  return template;
}

export async function getTemplates(category?: string): Promise<types.Template[]> {
  if (category) {
    const result = await docClient.send(new QueryCommand({
      TableName: TABLES.TEMPLATES,
      IndexName: 'CategoryIndex',
      KeyConditionExpression: 'category = :category',
      ExpressionAttributeValues: { ':category': category },
    }));
    return result.Items as types.Template[] || [];
  } else {
    const result = await docClient.send(new ScanCommand({
      TableName: TABLES.TEMPLATES,
    }));
    return result.Items as types.Template[] || [];
  }
}

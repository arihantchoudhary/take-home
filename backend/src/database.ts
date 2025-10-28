import fs from 'fs/promises';
import path from 'path';
import * as types from './types';

const DATA_DIR = path.join(__dirname, '../data');
const FILES = {
  blocks: path.join(DATA_DIR, 'blocks.json'),
  workspaces: path.join(DATA_DIR, 'workspaces.json'),
  pages: path.join(DATA_DIR, 'pages.json'),
  users: path.join(DATA_DIR, 'users.json'),
  workspaceMembers: path.join(DATA_DIR, 'workspace-members.json'),
  pageShares: path.join(DATA_DIR, 'page-shares.json'),
  comments: path.join(DATA_DIR, 'comments.json'),
  notifications: path.join(DATA_DIR, 'notifications.json'),
  favorites: path.join(DATA_DIR, 'favorites.json'),
  templates: path.join(DATA_DIR, 'templates.json'),
};

// Generic file operations
async function ensureFile<T>(filePath: string, defaultData: T): Promise<void> {
  try {
    await fs.access(filePath);
  } catch {
    await fs.mkdir(path.dirname(filePath), { recursive: true });
    await fs.writeFile(filePath, JSON.stringify(defaultData, null, 2));
  }
}

async function readFile<T>(filePath: string, defaultData: T): Promise<T> {
  await ensureFile(filePath, defaultData);
  const data = await fs.readFile(filePath, 'utf-8');
  return JSON.parse(data);
}

async function writeFile<T>(filePath: string, data: T): Promise<void> {
  await fs.mkdir(path.dirname(filePath), { recursive: true});
  await fs.writeFile(filePath, JSON.stringify(data, null, 2));
}

// ============= BLOCKS =============

export async function getAllBlocks(): Promise<types.Block[]> {
  const data = await readFile<{ blocks: types.Block[] }>(FILES.blocks, { blocks: [] });
  return data.blocks;
}

export async function getBlockById(blockId: string): Promise<types.Block | null> {
  const blocks = await getAllBlocks();
  return blocks.find(b => b.blockId === blockId) || null;
}

export async function getBlocksByPage(pageId: string): Promise<types.Block[]> {
  const blocks = await getAllBlocks();
  return blocks.filter(b => b.pageId === pageId).sort((a, b) => a.order - b.order);
}

export async function createBlock(block: types.Block): Promise<types.Block> {
  const blocks = await getAllBlocks();
  blocks.push(block);
  await writeFile(FILES.blocks, { blocks });
  return block;
}

export async function updateBlock(blockId: string, updates: Partial<types.Block>): Promise<types.Block | null> {
  const blocks = await getAllBlocks();
  const index = blocks.findIndex(b => b.blockId === blockId);
  if (index === -1) return null;

  blocks[index] = { ...blocks[index], ...updates, blockId, updatedAt: Date.now() } as types.Block;
  await writeFile(FILES.blocks, { blocks });
  return blocks[index];
}

export async function deleteBlock(blockId: string): Promise<boolean> {
  const blocks = await getAllBlocks();
  const filtered = blocks.filter(b => b.blockId !== blockId);
  if (filtered.length === blocks.length) return false;

  await writeFile(FILES.blocks, { blocks: filtered });
  return true;
}

// ============= WORKSPACES =============

export async function getAllWorkspaces(): Promise<types.Workspace[]> {
  const data = await readFile<{ workspaces: types.Workspace[] }>(FILES.workspaces, { workspaces: [] });
  return data.workspaces;
}

export async function getWorkspaceById(workspaceId: string): Promise<types.Workspace | null> {
  const workspaces = await getAllWorkspaces();
  return workspaces.find(w => w.workspaceId === workspaceId) || null;
}

export async function createWorkspace(workspace: types.Workspace): Promise<types.Workspace> {
  const workspaces = await getAllWorkspaces();
  workspaces.push(workspace);
  await writeFile(FILES.workspaces, { workspaces });
  return workspace;
}

export async function updateWorkspace(workspaceId: string, updates: Partial<types.Workspace>): Promise<types.Workspace | null> {
  const workspaces = await getAllWorkspaces();
  const index = workspaces.findIndex(w => w.workspaceId === workspaceId);
  if (index === -1) return null;

  workspaces[index] = { ...workspaces[index], ...updates, workspaceId, updatedAt: Date.now() };
  await writeFile(FILES.workspaces, { workspaces });
  return workspaces[index];
}

export async function deleteWorkspace(workspaceId: string): Promise<boolean> {
  const workspaces = await getAllWorkspaces();
  const filtered = workspaces.filter(w => w.workspaceId !== workspaceId);
  if (filtered.length === workspaces.length) return false;

  await writeFile(FILES.workspaces, { workspaces: filtered });
  return true;
}

// ============= PAGES =============

export async function getAllPages(): Promise<types.Page[]> {
  const data = await readFile<{ pages: types.Page[] }>(FILES.pages, { pages: [] });
  return data.pages;
}

export async function getPageById(pageId: string): Promise<types.Page | null> {
  const pages = await getAllPages();
  return pages.find(p => p.pageId === pageId) || null;
}

export async function getPagesByWorkspace(workspaceId: string): Promise<types.Page[]> {
  const pages = await getAllPages();
  return pages.filter(p => p.workspaceId === workspaceId);
}

export async function getChildPages(parentPageId: string): Promise<types.Page[]> {
  const pages = await getAllPages();
  return pages.filter(p => p.parentPageId === parentPageId);
}

export async function createPage(page: types.Page): Promise<types.Page> {
  const pages = await getAllPages();
  pages.push(page);
  await writeFile(FILES.pages, { pages });
  return page;
}

export async function updatePage(pageId: string, updates: Partial<types.Page>): Promise<types.Page | null> {
  const pages = await getAllPages();
  const index = pages.findIndex(p => p.pageId === pageId);
  if (index === -1) return null;

  pages[index] = { ...pages[index], ...updates, pageId, updatedAt: Date.now() };
  await writeFile(FILES.pages, { pages });
  return pages[index];
}

export async function deletePage(pageId: string): Promise<boolean> {
  const pages = await getAllPages();
  const filtered = pages.filter(p => p.pageId !== pageId);
  if (filtered.length === pages.length) return false;

  await writeFile(FILES.pages, { pages: filtered });
  return true;
}

// ============= USERS =============

export async function getAllUsers(): Promise<types.User[]> {
  const data = await readFile<{ users: types.User[] }>(FILES.users, { users: [] });
  return data.users;
}

export async function getUserById(userId: string): Promise<types.User | null> {
  const users = await getAllUsers();
  return users.find(u => u.userId === userId) || null;
}

export async function getUserByEmail(email: string): Promise<types.User | null> {
  const users = await getAllUsers();
  return users.find(u => u.email === email) || null;
}

export async function createUser(user: types.User): Promise<types.User> {
  const users = await getAllUsers();
  users.push(user);
  await writeFile(FILES.users, { users });
  return user;
}

export async function updateUser(userId: string, updates: Partial<types.User>): Promise<types.User | null> {
  const users = await getAllUsers();
  const index = users.findIndex(u => u.userId === userId);
  if (index === -1) return null;

  users[index] = { ...users[index], ...updates, userId, updatedAt: Date.now() };
  await writeFile(FILES.users, { users });
  return users[index];
}

export async function deleteUser(userId: string): Promise<boolean> {
  const users = await getAllUsers();
  const filtered = users.filter(u => u.userId !== userId);
  if (filtered.length === users.length) return false;

  await writeFile(FILES.users, { users: filtered });
  return true;
}

// ============= WORKSPACE MEMBERS =============

export async function getAllWorkspaceMembers(): Promise<types.WorkspaceMember[]> {
  const data = await readFile<{ members: types.WorkspaceMember[] }>(FILES.workspaceMembers, { members: [] });
  return data.members;
}

export async function getWorkspaceMembers(workspaceId: string): Promise<types.WorkspaceMember[]> {
  const members = await getAllWorkspaceMembers();
  return members.filter(m => m.workspaceId === workspaceId);
}

export async function getUserWorkspaces(userId: string): Promise<types.WorkspaceMember[]> {
  const members = await getAllWorkspaceMembers();
  return members.filter(m => m.userId === userId);
}

export async function addWorkspaceMember(member: types.WorkspaceMember): Promise<types.WorkspaceMember> {
  const members = await getAllWorkspaceMembers();
  members.push(member);
  await writeFile(FILES.workspaceMembers, { members });
  return member;
}

export async function removeWorkspaceMember(workspaceId: string, userId: string): Promise<boolean> {
  const members = await getAllWorkspaceMembers();
  const filtered = members.filter(m => !(m.workspaceId === workspaceId && m.userId === userId));
  if (filtered.length === members.length) return false;

  await writeFile(FILES.workspaceMembers, { members: filtered });
  return true;
}

// ============= PAGE SHARES =============

export async function getAllPageShares(): Promise<types.PageShare[]> {
  const data = await readFile<{ shares: types.PageShare[] }>(FILES.pageShares, { shares: [] });
  return data.shares;
}

export async function getPageShares(pageId: string): Promise<types.PageShare[]> {
  const shares = await getAllPageShares();
  return shares.filter(s => s.pageId === pageId);
}

export async function getUserPageShares(userId: string): Promise<types.PageShare[]> {
  const shares = await getAllPageShares();
  return shares.filter(s => s.userId === userId);
}

export async function createPageShare(share: types.PageShare): Promise<types.PageShare> {
  const shares = await getAllPageShares();
  shares.push(share);
  await writeFile(FILES.pageShares, { shares });
  return share;
}

export async function deletePageShare(pageId: string, userId: string): Promise<boolean> {
  const shares = await getAllPageShares();
  const filtered = shares.filter(s => !(s.pageId === pageId && s.userId === userId));
  if (filtered.length === shares.length) return false;

  await writeFile(FILES.pageShares, { shares: filtered });
  return true;
}

// ============= COMMENTS =============

export async function getAllComments(): Promise<types.Comment[]> {
  const data = await readFile<{ comments: types.Comment[] }>(FILES.comments, { comments: [] });
  return data.comments;
}

export async function getCommentById(commentId: string): Promise<types.Comment | null> {
  const comments = await getAllComments();
  return comments.find(c => c.commentId === commentId) || null;
}

export async function getPageComments(pageId: string): Promise<types.Comment[]> {
  const comments = await getAllComments();
  return comments.filter(c => c.pageId === pageId);
}

export async function getBlockComments(blockId: string): Promise<types.Comment[]> {
  const comments = await getAllComments();
  return comments.filter(c => c.blockId === blockId);
}

export async function createComment(comment: types.Comment): Promise<types.Comment> {
  const comments = await getAllComments();
  comments.push(comment);
  await writeFile(FILES.comments, { comments });
  return comment;
}

export async function updateComment(commentId: string, updates: Partial<types.Comment>): Promise<types.Comment | null> {
  const comments = await getAllComments();
  const index = comments.findIndex(c => c.commentId === commentId);
  if (index === -1) return null;

  comments[index] = { ...comments[index], ...updates, commentId, updatedAt: Date.now() };
  await writeFile(FILES.comments, { comments });
  return comments[index];
}

export async function deleteComment(commentId: string): Promise<boolean> {
  const comments = await getAllComments();
  const filtered = comments.filter(c => c.commentId !== commentId);
  if (filtered.length === comments.length) return false;

  await writeFile(FILES.comments, { comments: filtered });
  return true;
}

// ============= NOTIFICATIONS =============

export async function getAllNotifications(): Promise<types.Notification[]> {
  const data = await readFile<{ notifications: types.Notification[] }>(FILES.notifications, { notifications: [] });
  return data.notifications;
}

export async function getUserNotifications(userId: string): Promise<types.Notification[]> {
  const notifications = await getAllNotifications();
  return notifications.filter(n => n.userId === userId).sort((a, b) => b.createdAt - a.createdAt);
}

export async function createNotification(notification: types.Notification): Promise<types.Notification> {
  const notifications = await getAllNotifications();
  notifications.push(notification);
  await writeFile(FILES.notifications, { notifications });
  return notification;
}

export async function markNotificationAsRead(notificationId: string): Promise<types.Notification | null> {
  const notifications = await getAllNotifications();
  const index = notifications.findIndex(n => n.notificationId === notificationId);
  if (index === -1) return null;

  notifications[index].read = true;
  await writeFile(FILES.notifications, { notifications });
  return notifications[index];
}

export async function deleteNotification(notificationId: string): Promise<boolean> {
  const notifications = await getAllNotifications();
  const filtered = notifications.filter(n => n.notificationId !== notificationId);
  if (filtered.length === notifications.length) return false;

  await writeFile(FILES.notifications, { notifications: filtered });
  return true;
}

// ============= FAVORITES =============

export async function getAllFavorites(): Promise<types.Favorite[]> {
  const data = await readFile<{ favorites: types.Favorite[] }>(FILES.favorites, { favorites: [] });
  return data.favorites;
}

export async function getUserFavorites(userId: string): Promise<types.Favorite[]> {
  const favorites = await getAllFavorites();
  return favorites.filter(f => f.userId === userId).sort((a, b) => a.order - b.order);
}

export async function addFavorite(favorite: types.Favorite): Promise<types.Favorite> {
  const favorites = await getAllFavorites();
  favorites.push(favorite);
  await writeFile(FILES.favorites, { favorites });
  return favorite;
}

export async function removeFavorite(userId: string, pageId: string): Promise<boolean> {
  const favorites = await getAllFavorites();
  const filtered = favorites.filter(f => !(f.userId === userId && f.pageId === pageId));
  if (filtered.length === favorites.length) return false;

  await writeFile(FILES.favorites, { favorites: filtered });
  return true;
}

// ============= TEMPLATES =============

export async function getAllTemplates(): Promise<types.Template[]> {
  const data = await readFile<{ templates: types.Template[] }>(FILES.templates, { templates: [] });
  return data.templates;
}

export async function getTemplateById(templateId: string): Promise<types.Template | null> {
  const templates = await getAllTemplates();
  return templates.find(t => t.templateId === templateId) || null;
}

export async function getTemplatesByCategory(category: string): Promise<types.Template[]> {
  const templates = await getAllTemplates();
  return templates.filter(t => t.category === category);
}

export async function createTemplate(template: types.Template): Promise<types.Template> {
  const templates = await getAllTemplates();
  templates.push(template);
  await writeFile(FILES.templates, { templates });
  return template;
}

export async function updateTemplate(templateId: string, updates: Partial<types.Template>): Promise<types.Template | null> {
  const templates = await getAllTemplates();
  const index = templates.findIndex(t => t.templateId === templateId);
  if (index === -1) return null;

  templates[index] = { ...templates[index], ...updates, templateId };
  await writeFile(FILES.templates, { templates });
  return templates[index];
}

export async function deleteTemplate(templateId: string): Promise<boolean> {
  const templates = await getAllTemplates();
  const filtered = templates.filter(t => t.templateId !== templateId);
  if (filtered.length === templates.length) return false;

  await writeFile(FILES.templates, { templates: filtered });
  return true;
}

// ============= SEARCH =============

export async function search(workspaceId: string, query: string): Promise<types.SearchResult[]> {
  const pages = await getPagesByWorkspace(workspaceId);
  const blocks = await getAllBlocks();
  const results: types.SearchResult[] = [];

  const lowerQuery = query.toLowerCase();

  // Search pages
  for (const page of pages) {
    if (page.title.toLowerCase().includes(lowerQuery)) {
      results.push({
        type: 'page',
        id: page.pageId,
        pageId: page.pageId,
        title: page.title,
        preview: page.title,
        createdAt: page.createdAt,
        createdBy: page.createdBy,
      });
    }
  }

  // Search blocks
  for (const block of blocks) {
    if (block.type === 'text' && block.value.toLowerCase().includes(lowerQuery)) {
      const page = pages.find(p => p.pageId === block.pageId);
      results.push({
        type: 'block',
        id: block.blockId,
        pageId: block.pageId,
        title: page?.title,
        content: block.value,
        preview: block.value.substring(0, 200),
        createdAt: block.createdAt,
        createdBy: block.createdBy,
      });
    }
  }

  return results;
}

// ============= ALIASES FOR COMPATIBILITY =============
export const getPage = getPageById;
export const getUser = getUserById;
export const getWorkspace = getWorkspaceById;
export const getBlock = getBlockById;
export const getPageBlocks = getBlocksByPage;
export const getWorkspacePages = getPagesByWorkspace;
export const markNotificationRead = markNotificationAsRead;
export const getTemplates = getAllTemplates;
export const searchPages = search;
export const sharePage = createPageShare;
export const resolveComment = async (commentId: string): Promise<any | null> => {
  return updateComment(commentId, { resolved: true });
};

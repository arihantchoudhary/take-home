// ============= Basic Types =============

export type TextType = 'h1' | 'h2' | 'h3' | 'paragraph' | 'bullet' | 'numbered' | 'todo' | 'toggle' | 'quote' | 'code';
export type BlockType = 'text' | 'image' | 'video' | 'embed' | 'divider' | 'checkbox';

// Base interface for all blocks with DynamoDB fields
interface BaseBlock {
  blockId: string;
  pageId: string;
  order: number;
  createdAt: number;
  updatedAt: number;
  createdBy: string;
}

export interface TextBlock extends BaseBlock {
  type: 'text';
  textType: TextType;
  value: string;
}

export interface ImageBlock extends BaseBlock {
  type: 'image';
  src: string;
  width?: number;
  height?: number;
  caption?: string;
}

export interface VideoBlock extends BaseBlock {
  type: 'video';
  src: string;
  width?: number;
  height?: number;
}

export interface EmbedBlock extends BaseBlock {
  type: 'embed';
  url: string;
  embedType: 'pdf' | 'google-maps' | 'figma' | 'youtube' | 'other';
}

export interface DividerBlock extends BaseBlock {
  type: 'divider';
}

export interface CheckboxBlock extends BaseBlock {
  type: 'checkbox';
  checked: boolean;
  label: string;
}

export type Block = TextBlock | ImageBlock | VideoBlock | EmbedBlock | DividerBlock | CheckboxBlock;

export interface BlocksData {
  blocks: Block[];
}

// ============= DynamoDB Types =============

export interface Workspace {
  workspaceId: string;
  name: string;
  ownerId: string;
  icon?: string;
  createdAt: number;
  updatedAt: number;
}

export interface Page {
  pageId: string;
  workspaceId: string;
  title: string;
  icon?: string;
  coverImage?: string;
  parentPageId?: string;
  order?: number;
  isPrivate: boolean;
  createdAt: number;
  updatedAt: number;
  createdBy: string;
  lastEditedBy: string;
}

export interface CreatePageRequest {
  workspaceId: string;
  title: string;
  icon?: string;
  coverImage?: string;
  parentPageId?: string;
  order?: number;
  isPrivate?: boolean;
}

export interface UpdatePageRequest {
  title?: string;
  icon?: string;
  coverImage?: string;
  order?: number;
  isPrivate?: boolean;
}

export interface WorkspaceMember {
  workspaceId: string;
  userId: string;
  role: 'owner' | 'admin' | 'member';
  joinedAt: number;
}

export interface User {
  userId: string;
  email: string;
  name: string;
  avatar?: string;
  createdAt: number;
  updatedAt: number;
}

export interface PageShare {
  pageId: string;
  userId: string;
  permission: 'view' | 'comment' | 'edit';
  sharedAt: number;
  sharedBy: string;
}

export interface Comment {
  commentId: string;
  pageId: string;
  blockId?: string;
  content: string;
  mentions?: string[];
  createdBy: string;
  createdAt: number;
  updatedAt: number;
  resolved: boolean;
  parentCommentId?: string;
}

export interface CreateCommentRequest {
  pageId: string;
  blockId?: string;
  content: string;
  mentions?: string[];
  parentCommentId?: string;
}

export interface Notification {
  notificationId: string;
  userId: string;
  type: 'mention' | 'comment' | 'share' | 'update';
  title: string;
  message: string;
  pageId?: string;
  blockId?: string;
  commentId?: string;
  relatedUserId?: string;
  read: boolean;
  createdAt: number;
}

export interface Favorite {
  userId: string;
  pageId: string;
  order: number;
  addedAt: number;
}

export interface SearchRequest {
  workspaceId: string;
  query: string;
}

export interface SearchResult {
  type: 'page' | 'block';
  id: string;
  pageId: string;
  title?: string;
  content?: string;
  highlight?: string;
  preview?: string;
  highlights?: string[];
  createdAt?: number;
  createdBy?: string;
}

export interface Template {
  templateId: string;
  name: string;
  description: string;
  category: string;
  icon?: string;
  content: Block[];
  isPublic: boolean;
  createdBy: string;
  createdAt: number;
}

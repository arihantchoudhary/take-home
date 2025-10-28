// ============= Block Types =============

export type TextType = 'h1' | 'h2' | 'h3' | 'paragraph' | 'bullet' | 'numbered' | 'todo' | 'toggle' | 'quote' | 'code';
export type BlockType = 'text' | 'image' | 'video' | 'embed' | 'divider' | 'table' | 'checkbox';

export interface BaseBlock {
  blockId: string;
  pageId: string;
  type: BlockType;
  order: number;
  createdAt: number;
  updatedAt: number;
  createdBy: string;
}

export interface TextBlock extends BaseBlock {
  type: 'text';
  textType: TextType;
  value: string;
  color?: string;
  backgroundColor?: string;
}

export interface ImageBlock extends BaseBlock {
  type: 'image';
  src: string;
  width: number;
  height: number;
  caption?: string;
}

export interface VideoBlock extends BaseBlock {
  type: 'video';
  src: string;
  width: number;
  height: number;
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

// ============= Page Types =============

export interface Page {
  pageId: string;
  workspaceId: string;
  title: string;
  icon?: string;
  coverImage?: string;
  parentPageId?: string; // null for root pages
  order: number;
  isPrivate: boolean;
  createdAt: number;
  updatedAt: number;
  createdBy: string;
  lastEditedBy: string;
}

// ============= Workspace Types =============

export interface Workspace {
  workspaceId: string;
  name: string;
  icon?: string;
  createdAt: number;
  updatedAt: number;
  ownerId: string;
}

export interface WorkspaceMember {
  workspaceId: string;
  userId: string;
  role: 'owner' | 'admin' | 'member';
  joinedAt: number;
}

// ============= User Types =============

export interface User {
  userId: string;
  email: string;
  name: string;
  avatar?: string;
  createdAt: number;
  updatedAt: number;
}

// ============= Share/Guest Types =============

export interface PageShare {
  pageId: string;
  userId: string;
  permission: 'view' | 'comment' | 'edit';
  sharedAt: number;
  sharedBy: string;
}

// ============= Comment Types =============

export interface Comment {
  commentId: string;
  pageId: string;
  blockId?: string; // null for page-level comments
  content: string;
  mentions: string[]; // array of userIds
  createdBy: string;
  createdAt: number;
  updatedAt: number;
  resolved: boolean;
  parentCommentId?: string; // for threaded replies
}

// ============= Notification Types =============

export type NotificationType = 'mention' | 'comment' | 'page_shared' | 'page_updated' | 'reminder';

export interface Notification {
  notificationId: string;
  userId: string;
  type: NotificationType;
  title: string;
  message: string;
  pageId?: string;
  commentId?: string;
  read: boolean;
  createdAt: number;
  relatedUserId?: string; // user who triggered the notification
}

// ============= Favorites Types =============

export interface Favorite {
  userId: string;
  pageId: string;
  order: number;
  addedAt: number;
}

// ============= Template Types =============

export interface Template {
  templateId: string;
  name: string;
  description: string;
  category: string;
  icon?: string;
  coverImage?: string;
  content: Block[]; // pre-defined blocks
  createdAt: number;
  isPublic: boolean;
  createdBy: string;
}

// ============= API Request/Response Types =============

export interface CreateBlockRequest {
  pageId: string;
  type: BlockType;
  order: number;
  data: Partial<Block>;
}

export interface UpdateBlockRequest {
  data: Partial<Block>;
}

export interface CreatePageRequest {
  workspaceId: string;
  title: string;
  parentPageId?: string;
  icon?: string;
  coverImage?: string;
  isPrivate?: boolean;
}

export interface UpdatePageRequest {
  title?: string;
  icon?: string;
  coverImage?: string;
  parentPageId?: string;
  order?: number;
  isPrivate?: boolean;
}

export interface CreateCommentRequest {
  pageId: string;
  blockId?: string;
  content: string;
  mentions?: string[];
  parentCommentId?: string;
}

export interface SearchRequest {
  query: string;
  workspaceId: string;
  filters?: {
    createdBy?: string;
    dateRange?: {
      start: number;
      end: number;
    };
    pageIds?: string[];
  };
}

export interface SearchResult {
  type: 'page' | 'block';
  id: string;
  title: string;
  preview: string;
  pageId: string;
  highlights: string[];
  createdAt: number;
  createdBy: string;
}

// ============= Error Types =============

export interface ApiError {
  error: string;
  message: string;
  statusCode: number;
}

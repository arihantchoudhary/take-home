# Notion Clone API Documentation

A comprehensive REST API for building a Notion-like application with workspaces, pages, blocks, collaboration features, comments, mentions, search, and more.

## Base URL

```
http://localhost:3001
```

## API Endpoints

### Workspaces

#### Create Workspace
```http
POST /api/workspaces
Content-Type: application/json

{
  "name": "My Workspace",
  "ownerId": "user-123"
}
```

#### Get Workspace
```http
GET /api/workspaces/:workspaceId
```

#### Update Workspace
```http
PUT /api/workspaces/:workspaceId
Content-Type: application/json

{
  "name": "Updated Workspace Name",
  "icon": "🚀"
}
```

#### Get Workspace Members
```http
GET /api/workspaces/:workspaceId/members
```

#### Add Workspace Member
```http
POST /api/workspaces/:workspaceId/members
Content-Type: application/json

{
  "userId": "user-456",
  "role": "member"  // "owner" | "admin" | "member"
}
```

---

### Pages

#### Create Page
```http
POST /api/pages
Content-Type: application/json

{
  "workspaceId": "workspace-123",
  "title": "My New Page",
  "parentPageId": "parent-page-123",  // optional, for nested pages
  "icon": "📝",  // optional
  "coverImage": "https://...",  // optional
  "isPrivate": false,  // optional
  "userId": "user-123"
}
```

#### Get Page
```http
GET /api/pages/:pageId
```

#### Update Page
```http
PUT /api/pages/:pageId
Content-Type: application/json

{
  "title": "Updated Page Title",
  "icon": "📘",
  "userId": "user-123"
}
```

#### Delete Page
```http
DELETE /api/pages/:pageId
```

#### Get Child Pages
```http
GET /api/pages/:pageId/children
```

#### Get Page Blocks
```http
GET /api/pages/:pageId/blocks
```

#### Get Workspace Pages
```http
GET /api/pages/workspace/:workspaceId
```

#### Share Page
```http
POST /api/pages/:pageId/share
Content-Type: application/json

{
  "userId": "user-789",
  "permission": "edit",  // "view" | "comment" | "edit"
  "sharedBy": "user-123"
}
```

#### Get Page Shares
```http
GET /api/pages/:pageId/shares
```

---

### Blocks

#### Create Block
```http
POST /api/blocks
Content-Type: application/json

// Text Block
{
  "pageId": "page-123",
  "type": "text",
  "textType": "h1",  // "h1" | "h2" | "h3" | "paragraph" | "bullet" | "numbered" | "todo" | "toggle" | "quote" | "code"
  "value": "Hello World",
  "order": 0,
  "userId": "user-123"
}

// Image Block
{
  "pageId": "page-123",
  "type": "image",
  "src": "https://example.com/image.jpg",
  "width": 800,
  "height": 600,
  "caption": "An image",  // optional
  "order": 1,
  "userId": "user-123"
}

// Video Block
{
  "pageId": "page-123",
  "type": "video",
  "src": "https://example.com/video.mp4",
  "width": 1280,
  "height": 720,
  "order": 2,
  "userId": "user-123"
}

// Embed Block
{
  "pageId": "page-123",
  "type": "embed",
  "url": "https://maps.google.com/...",
  "embedType": "google-maps",  // "pdf" | "google-maps" | "figma" | "youtube" | "other"
  "order": 3,
  "userId": "user-123"
}

// Divider Block
{
  "pageId": "page-123",
  "type": "divider",
  "order": 4,
  "userId": "user-123"
}

// Checkbox Block
{
  "pageId": "page-123",
  "type": "checkbox",
  "checked": false,
  "label": "Task to complete",
  "order": 5,
  "userId": "user-123"
}
```

#### Get Block
```http
GET /api/blocks/:blockId
```

#### Update Block
```http
PUT /api/blocks/:blockId
Content-Type: application/json

{
  "value": "Updated text content",
  "userId": "user-123"
}
```

#### Delete Block
```http
DELETE /api/blocks/:blockId
```

#### Get Block Comments
```http
GET /api/blocks/:blockId/comments
```

---

### Users

#### Create User
```http
POST /api/users
Content-Type: application/json

{
  "email": "user@example.com",
  "name": "John Doe"
}
```

#### Get User
```http
GET /api/users/:userId
```

#### Get User by Email
```http
GET /api/users/email/:email
```

#### Get User Workspaces
```http
GET /api/users/:userId/workspaces
```

---

### Comments

#### Create Comment
```http
POST /api/comments
Content-Type: application/json

// Page-level comment
{
  "pageId": "page-123",
  "content": "Great work!",
  "mentions": ["user-456", "user-789"],  // optional
  "userId": "user-123"
}

// Block-level comment
{
  "pageId": "page-123",
  "blockId": "block-456",
  "content": "Check this @user-456",
  "mentions": ["user-456"],
  "userId": "user-123"
}

// Reply to comment
{
  "pageId": "page-123",
  "content": "Thanks!",
  "parentCommentId": "comment-999",
  "userId": "user-123"
}
```

#### Get Page Comments
```http
GET /api/comments/page/:pageId
```

#### Resolve Comment
```http
PUT /api/comments/:commentId/resolve
```

---

### Notifications

#### Get User Notifications
```http
GET /api/notifications/:userId
```

#### Mark Notification as Read
```http
PUT /api/notifications/:notificationId/read
```

---

### Favorites

#### Get User Favorites
```http
GET /api/favorites/:userId
```

#### Add Favorite
```http
POST /api/favorites
Content-Type: application/json

{
  "userId": "user-123",
  "pageId": "page-456"
}
```

#### Remove Favorite
```http
DELETE /api/favorites/:userId/:pageId
```

---

### Search

#### Search Pages and Blocks
```http
POST /api/search
Content-Type: application/json

{
  "query": "search term",
  "workspaceId": "workspace-123",
  "filters": {  // optional
    "createdBy": "user-123",
    "dateRange": {
      "start": 1609459200000,
      "end": 1640995200000
    },
    "pageIds": ["page-1", "page-2"]
  }
}
```

Response:
```json
[
  {
    "type": "page",
    "id": "page-123",
    "title": "My Page",
    "preview": "My Page",
    "pageId": "page-123",
    "highlights": ["My Page"],
    "createdAt": 1609459200000,
    "createdBy": "user-123"
  },
  {
    "type": "block",
    "id": "block-456",
    "title": "My Page",
    "preview": "This is some text content...",
    "pageId": "page-123",
    "highlights": ["text content"],
    "createdAt": 1609459200000,
    "createdBy": "user-123"
  }
]
```

---

### Templates

#### Get Templates
```http
GET /api/templates
GET /api/templates?category=project-management
```

#### Create Template
```http
POST /api/templates
Content-Type: application/json

{
  "name": "Meeting Notes Template",
  "description": "Template for meeting notes",
  "category": "productivity",
  "icon": "📝",
  "content": [
    {
      "type": "text",
      "textType": "h1",
      "value": "Meeting Notes",
      "order": 0
    },
    {
      "type": "text",
      "textType": "paragraph",
      "value": "Date: ",
      "order": 1
    }
  ],
  "isPublic": true,
  "createdBy": "user-123"
}
```

---

## Block Types

The API supports the following block types:

1. **Text Blocks** - Various text formatting options
   - `h1`, `h2`, `h3` - Headings
   - `paragraph` - Regular text
   - `bullet`, `numbered` - Lists
   - `todo` - Checkable items
   - `toggle` - Collapsible sections
   - `quote` - Quoted text
   - `code` - Code blocks

2. **Image Blocks** - Images with customizable dimensions
3. **Video Blocks** - Embedded videos
4. **Embed Blocks** - External content (PDFs, Google Maps, etc.)
5. **Divider Blocks** - Visual separators
6. **Checkbox Blocks** - Task items

---

## Features Implemented

### Core Features (from Notion transcript)
- ✅ **Content Creation** - Add and edit various block types
- ✅ **Text Formatting** - Headings, colors, highlights
- ✅ **Drag & Drop** - Blocks can be reordered via order property
- ✅ **Page Hierarchy** - Nested pages inside pages
- ✅ **Workspace Organization** - Shared and private sections
- ✅ **Sidebar Management** - Favorites for quick access
- ✅ **Search** - Find pages and content across workspace
- ✅ **Collaboration** - Share pages with team members or guests
- ✅ **Comments** - Block-level and page-level discussions
- ✅ **Mentions** - Notify users with @mentions
- ✅ **Notifications** - Track mentions and updates
- ✅ **Templates** - Reusable page structures

### Database Features
- ✅ **10 DynamoDB Tables** - Comprehensive data model
- ✅ **AWS Infrastructure** - Terraform configuration
- ✅ **Scalable Architecture** - PAY_PER_REQUEST billing mode
- ✅ **Global Secondary Indexes** - Efficient querying

---

## Error Responses

All endpoints return standard error responses:

```json
{
  "error": "Error message"
}
```

Status codes:
- `200` - Success
- `201` - Created
- `204` - No Content (successful deletion)
- `400` - Bad Request
- `404` - Not Found
- `409` - Conflict (e.g., user already exists)
- `500` - Internal Server Error

---

## Development

### Setup
```bash
# Install dependencies
npm install

# Copy environment file
cp .env.example .env

# Run development server
npm run dev

# Build for production
npm run build

# Run production server
npm start
```

### Infrastructure
```bash
# Navigate to infra directory
cd infra

# Initialize Terraform
terraform init

# Deploy infrastructure
terraform apply

# Get table names
terraform output
```

---

## Notes

- All timestamps are in Unix epoch milliseconds
- User authentication is simplified (uses `userId` field) - in production, implement proper JWT/OAuth
- Search is basic text matching - in production, use AWS OpenSearch or Elasticsearch
- File uploads not implemented - use S3 presigned URLs in production

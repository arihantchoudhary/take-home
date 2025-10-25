# Notion-like API

A comprehensive FastAPI backend for a Notion-like application with support for pages, blocks, collaboration, and more.

## Features

- **Block Management**: Support for multiple block types (text, todo, bullet list, code, images, videos, etc.)
- **Page Hierarchy**: Nested pages with parent-child relationships
- **Search**: Full-text search across pages and blocks
- **Collaboration**: Comments, mentions, and page sharing
- **Activity Feed**: Track all user activities and notifications
- **Favorites**: Mark pages as favorites for quick access

## Setup

1. Install Python 3.11 or higher

2. Install dependencies:
```bash
pip install -r requirements.txt
```

## Running the Server

```bash
python main.py
```

Or using uvicorn directly:
```bash
uvicorn main:app --reload --host 0.0.0.0 --port 8000
```

The API will be available at `http://localhost:8000`

## API Documentation

Once the server is running, visit:
- Swagger UI: `http://localhost:8000/docs`
- ReDoc: `http://localhost:8000/redoc`

## API Endpoints

### Core
- `GET /` - API information
- `GET /health` - Health check

### Blocks
- `GET /blocks` - Get all blocks
- `POST /blocks` - Create a new block
- `GET /blocks/{id}` - Get a specific block by ID
- `PUT /blocks/{id}` - Update a block by ID
- `DELETE /blocks/{id}` - Delete a block by ID
- `POST /blocks/{id}/duplicate` - Duplicate a block
- `PUT /blocks/reorder` - Reorder blocks

### Pages
- `GET /pages` - Get all pages (supports filters: favorites, private, parent, root)
- `POST /pages` - Create a new page
- `GET /pages/{id}` - Get a specific page by ID
- `PUT /pages/{id}` - Update a page by ID
- `DELETE /pages/{id}` - Delete a page by ID
- `GET /pages/{id}/children` - Get child pages
- `POST /pages/{id}/duplicate` - Duplicate a page
- `PUT /pages/{id}/move` - Move a page to a new parent
- `PUT /pages/{id}/favorite` - Toggle favorite status

### Search
- `GET /search` - Search across pages and blocks

### Comments
- `GET /comments` - Get comments (filter by block_id or page_id)
- `POST /comments` - Create a new comment
- `PUT /comments/{id}` - Update a comment
- `DELETE /comments/{id}` - Delete a comment
- `PUT /comments/{id}/resolve` - Resolve a comment

### Activities
- `GET /activities/{user_id}` - Get user activities (supports unread filter)
- `PUT /activities/{id}/read` - Mark activity as read
- `PUT /activities/users/{user_id}/read-all` - Mark all activities as read

### Shares
- `GET /shares/pages/{page_id}` - Get all shares for a page
- `POST /shares` - Share a page with a user
- `DELETE /shares/{id}` - Remove a page share

## Block Types

### Text Block
```json
{
  "id": "uuid",
  "type": "text",
  "textType": "h1|h2|h3|paragraph",
  "value": "Content here",
  "color": "#000000",
  "backgroundColor": "#ffffff"
}
```

### Todo Block
```json
{
  "id": "uuid",
  "type": "todo",
  "value": "Task description",
  "checked": false,
  "color": "#000000"
}
```

### Bullet List Block
```json
{
  "id": "uuid",
  "type": "bullet",
  "value": "List item",
  "color": "#000000"
}
```

### Numbered List Block
```json
{
  "id": "uuid",
  "type": "numbered",
  "value": "List item",
  "color": "#000000"
}
```

### Quote Block
```json
{
  "id": "uuid",
  "type": "quote",
  "value": "Quote text",
  "color": "#000000"
}
```

### Code Block
```json
{
  "id": "uuid",
  "type": "code",
  "value": "console.log('hello');",
  "language": "javascript"
}
```

### Divider Block
```json
{
  "id": "uuid",
  "type": "divider"
}
```

### Image Block
```json
{
  "id": "uuid",
  "type": "image",
  "src": "/path/to/image.jpg",
  "width": 800,
  "height": 600,
  "alt": "Description"
}
```

### Video Block
```json
{
  "id": "uuid",
  "type": "video",
  "src": "/path/to/video.mp4",
  "width": 800,
  "height": 600
}
```

## Data Storage

Data is stored in JSON files in `../my-app/data/`:
- `blocks.json` - All blocks
- `pages.json` - All pages
- `comments.json` - Comments and discussions
- `shares.json` - Page sharing permissions
- `activities.json` - User activity feed
- `users.json` - User information

# Simple Notion Clone

A simple version of Notion built with React + TypeScript frontend and Node.js + Express + TypeScript backend.

## Features

- **Display blocks**: View text and image blocks in a vertical list
- **Add blocks**: Create new text blocks (H1, H2, H3, Paragraph) or image blocks
- **Edit blocks**: Click on any block to edit its content
- **Delete blocks**: Remove blocks you no longer need
- **Persistent storage**: All data is saved to a JSON file on the backend

## Tech Stack

**Frontend:**
- React 19
- TypeScript
- Vite (build tool)

**Backend:**
- Node.js
- Express
- TypeScript
- JSON file storage

## Project Structure

```
take-home/
├── backend/          # Node.js + Express API
│   ├── src/
│   │   ├── server.ts      # Express server
│   │   ├── database.ts    # JSON file operations
│   │   └── types.ts       # TypeScript types
│   └── data/
│       └── blocks.json    # Data storage
└── frontend/         # React app
    └── src/
        ├── App.tsx               # Main app component
        ├── types.ts              # TypeScript types
        ├── api.ts                # API client
        └── components/
            ├── BlockRenderer.tsx # Display blocks
            └── BlockEditor.tsx   # Add/edit blocks
```

## Getting Started

### Prerequisites

- Node.js 18+ installed
- npm or pnpm

### Installation & Running

**Terminal 1 - Backend:**
```bash
cd backend
npm install
npm run dev
```

The backend will run on http://localhost:3001

**Terminal 2 - Frontend:**
```bash
cd frontend
npm install
npm run dev
```

The frontend will run on http://localhost:5173

## How to Test

1. **Open your browser** to http://localhost:5173

2. **Add a text block:**
   - Click "+ Add Block" button
   - Select "Text" as block type
   - Choose a text type (H1, H2, H3, or Paragraph)
   - Enter some text content
   - Click "Create"

3. **Add an image block:**
   - Click "+ Add Block" button
   - Select "Image" as block type
   - Enter an image URL (try: https://picsum.photos/400/300)
   - Set width and height (e.g., 400 x 300)
   - Click "Create"

4. **Edit a block:**
   - Click on any block text or image
   - Modify the values in the editor
   - Click "Update"

5. **Delete a block:**
   - Click the "Delete" button on any block
   - Confirm deletion

6. **Test persistence:**
   - Refresh the page - your blocks should still be there!
   - Stop and restart the backend server - data persists!
   - Check `backend/data/blocks.json` to see the stored data

## API Endpoints

The backend provides these REST API endpoints:

- `GET /api/blocks` - Get all blocks
- `GET /api/blocks/:id` - Get a single block
- `POST /api/blocks` - Create a new block
- `PUT /api/blocks/:id` - Update a block
- `DELETE /api/blocks/:id` - Delete a block
- `GET /health` - Health check

## Testing with curl

You can also test the API directly:

```bash
# Get all blocks
curl http://localhost:3001/api/blocks

# Create a text block
curl -X POST http://localhost:3001/api/blocks \
  -H "Content-Type: application/json" \
  -d '{
    "id": "block-1",
    "type": "text",
    "textType": "h1",
    "value": "Hello World"
  }'

# Create an image block
curl -X POST http://localhost:3001/api/blocks \
  -H "Content-Type: application/json" \
  -d '{
    "id": "block-2",
    "type": "image",
    "src": "https://picsum.photos/400/300",
    "width": 400,
    "height": 300
  }'
```

## Data Storage

All blocks are stored in `backend/data/blocks.json`. The file is created automatically when you first add a block.

Example data structure:
```json
{
  "blocks": [
    {
      "id": "block-1",
      "type": "text",
      "textType": "h1",
      "value": "Welcome to Simple Notion"
    },
    {
      "id": "block-2",
      "type": "image",
      "src": "https://picsum.photos/400/300",
      "width": 400,
      "height": 300
    }
  ]
}
```

## Development Notes

- Frontend uses inline styles for simplicity (no CSS library required)
- Backend automatically creates the data directory and JSON file if they don't exist
- CORS is enabled on the backend to allow frontend requests
- TypeScript provides type safety across the entire stack

## Built According to Requirements

This project fulfills the take-home requirements:

✅ React + TypeScript frontend
✅ Two block types: text (H1, H2, H3, paragraph) and image (with width/height/src)
✅ Load and display blocks from backend
✅ Add new blocks with customizable properties
✅ Edit existing blocks
✅ Persistent backend storage (JSON file, not BaaS)
✅ REST API for data access

## Potential Enhancements

If you want to add more features:
- Drag & drop to reorder blocks
- More block types (bullet lists, checkboxes, code blocks)
- Undo/redo functionality
- Real-time collaboration
- Rich text editing within blocks

# Block Management API

A FastAPI backend for managing text and image blocks.

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

### Root
- `GET /` - API information
- `GET /health` - Health check

### Blocks
- `GET /blocks` - Get all blocks
- `GET /blocks/{id}` - Get a specific block by ID
- `POST /blocks` - Create a new block
- `PUT /blocks/{id}` - Update a block by ID
- `DELETE /blocks/{id}` - Delete a block by ID

## Block Types

### Text Block
```json
{
  "id": "unique-id",
  "type": "text",
  "textType": "h1|h2|h3|paragraph",
  "value": "Block content"
}
```

### Image Block
```json
{
  "id": "unique-id",
  "type": "image",
  "src": "/path/to/image.jpg",
  "width": 800,
  "height": 600
}
```

## Data Storage

Blocks are stored in `../my-app/data/blocks.json` to maintain compatibility with the Next.js application.

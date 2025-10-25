from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from routers import blocks, pages, search, comments, activities, shares

app = FastAPI(
    title="Notion-like API",
    description="API for managing pages and blocks in a Notion-like application",
    version="1.0.0"
)

# CORS middleware to allow requests from Next.js frontend
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000", "http://127.0.0.1:3000"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Include routers
app.include_router(blocks.router)
app.include_router(pages.router)
app.include_router(search.router)
app.include_router(comments.router)
app.include_router(activities.router)
app.include_router(shares.router)


@app.get("/")
async def root():
    """Root endpoint with API information"""
    return {
        "message": "Notion-like API",
        "version": "1.0.0",
        "endpoints": {
            "blocks": {
                "GET /blocks": "Get all blocks",
                "POST /blocks": "Create a new block",
                "GET /blocks/{id}": "Get a specific block by ID",
                "PUT /blocks/{id}": "Update a block by ID",
                "DELETE /blocks/{id}": "Delete a block by ID",
                "POST /blocks/{id}/duplicate": "Duplicate a block",
                "PUT /blocks/reorder": "Reorder blocks"
            },
            "pages": {
                "GET /pages": "Get all pages (supports filters)",
                "POST /pages": "Create a new page",
                "GET /pages/{id}": "Get a specific page by ID",
                "PUT /pages/{id}": "Update a page by ID",
                "DELETE /pages/{id}": "Delete a page by ID",
                "GET /pages/{id}/children": "Get child pages",
                "POST /pages/{id}/duplicate": "Duplicate a page",
                "PUT /pages/{id}/move": "Move a page",
                "PUT /pages/{id}/favorite": "Toggle favorite status"
            },
            "search": {
                "GET /search": "Search across pages and blocks"
            },
            "comments": {
                "GET /comments": "Get comments (filter by block or page)",
                "POST /comments": "Create a new comment",
                "PUT /comments/{id}": "Update a comment",
                "DELETE /comments/{id}": "Delete a comment",
                "PUT /comments/{id}/resolve": "Resolve a comment"
            },
            "activities": {
                "GET /activities/{user_id}": "Get user activities (mentions, updates)",
                "PUT /activities/{id}/read": "Mark activity as read",
                "PUT /activities/users/{user_id}/read-all": "Mark all activities as read"
            },
            "shares": {
                "GET /shares/pages/{page_id}": "Get page shares",
                "POST /shares": "Share a page with a user",
                "DELETE /shares/{id}": "Remove a page share"
            }
        }
    }


@app.get("/health")
async def health_check():
    """Health check endpoint"""
    return {"status": "healthy"}


if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000, reload=True)

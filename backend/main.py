from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from routers import blocks

app = FastAPI(
    title="Block Management API",
    description="API for managing text and image blocks",
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


@app.get("/")
async def root():
    """Root endpoint with API information"""
    return {
        "message": "Block Management API",
        "version": "1.0.0",
        "endpoints": {
            "GET /blocks": "Get all blocks",
            "POST /blocks": "Create a new block",
            "GET /blocks/{id}": "Get a specific block by ID",
            "PUT /blocks/{id}": "Update a block by ID",
            "DELETE /blocks/{id}": "Delete a block by ID"
        }
    }


@app.get("/health")
async def health_check():
    """Health check endpoint"""
    return {"status": "healthy"}


if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000, reload=True)

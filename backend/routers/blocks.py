from fastapi import APIRouter, HTTPException
from typing import List, Union
from models import TextBlock, ImageBlock, BlockCreate, BlockUpdate
import database as db

router = APIRouter(
    prefix="/blocks",
    tags=["blocks"]
)


@router.get("", response_model=List[Union[TextBlock, ImageBlock]])
async def get_blocks():
    """Get all blocks"""
    try:
        blocks = db.get_all_blocks()
        return blocks
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Failed to fetch blocks: {str(e)}")


@router.get("/{block_id}", response_model=Union[TextBlock, ImageBlock])
async def get_block(block_id: str):
    """Get a specific block by ID"""
    try:
        block = db.get_block_by_id(block_id)
        if block is None:
            raise HTTPException(status_code=404, detail="Block not found")
        return block
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Failed to fetch block: {str(e)}")


@router.post("", response_model=Union[TextBlock, ImageBlock], status_code=201)
async def create_block(block: BlockCreate):
    """Create a new block"""
    try:
        # Check if ID already exists
        if db.block_exists(block.id):
            raise HTTPException(status_code=400, detail="Block with this ID already exists")

        # Convert to dict and create block
        new_block = block.model_dump(exclude_none=True)
        created_block = db.create_block(new_block)

        return created_block
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Failed to create block: {str(e)}")


@router.put("/{block_id}", response_model=Union[TextBlock, ImageBlock])
async def update_block(block_id: str, updates: BlockUpdate):
    """Update a block by ID"""
    try:
        # Get update data
        update_data = updates.model_dump(exclude_none=True)

        # Update the block
        updated_block = db.update_block_by_id(block_id, update_data)

        if updated_block is None:
            raise HTTPException(status_code=404, detail="Block not found")

        return updated_block
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Failed to update block: {str(e)}")


@router.delete("/{block_id}")
async def delete_block(block_id: str):
    """Delete a block by ID"""
    try:
        deleted = db.delete_block_by_id(block_id)

        if not deleted:
            raise HTTPException(status_code=404, detail="Block not found")

        return {"message": "Block deleted successfully", "id": block_id}
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Failed to delete block: {str(e)}")

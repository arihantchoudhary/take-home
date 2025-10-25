from fastapi import APIRouter, HTTPException, Query
from typing import List, Optional
from page_models import Page, PageCreate, PageUpdate
import page_database as page_db

router = APIRouter(
    prefix="/pages",
    tags=["pages"]
)


@router.get("", response_model=List[Page])
async def get_pages(
    favorites: Optional[bool] = Query(None, description="Filter by favorite status"),
    private: Optional[bool] = Query(None, description="Filter by private status"),
    parent_id: Optional[str] = Query(None, description="Filter by parent page ID"),
    root_only: Optional[bool] = Query(None, description="Get only root pages")
):
    """Get all pages with optional filters"""
    try:
        if favorites is not None and favorites:
            pages = page_db.get_favorite_pages()
        elif private is not None:
            if private:
                pages = page_db.get_private_pages()
            else:
                pages = page_db.get_workspace_pages()
        elif root_only:
            pages = page_db.get_root_pages()
        elif parent_id is not None:
            pages = page_db.get_child_pages(parent_id)
        else:
            pages = page_db.get_all_pages()

        return pages
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Failed to fetch pages: {str(e)}")


@router.get("/{page_id}", response_model=Page)
async def get_page(page_id: str):
    """Get a specific page by ID"""
    try:
        page = page_db.get_page_by_id(page_id)
        if page is None:
            raise HTTPException(status_code=404, detail="Page not found")
        return page
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Failed to fetch page: {str(e)}")


@router.get("/{page_id}/children", response_model=List[Page])
async def get_page_children(page_id: str):
    """Get all child pages of a specific page"""
    try:
        # Verify parent page exists
        if not page_db.page_exists(page_id):
            raise HTTPException(status_code=404, detail="Parent page not found")

        children = page_db.get_child_pages(page_id)
        return children
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Failed to fetch child pages: {str(e)}")


@router.post("", response_model=Page, status_code=201)
async def create_page(page: PageCreate):
    """Create a new page"""
    try:
        # Check if ID already exists
        if page_db.page_exists(page.id):
            raise HTTPException(status_code=400, detail="Page with this ID already exists")

        # Verify parent exists if parentId is provided
        if page.parentId and not page_db.page_exists(page.parentId):
            raise HTTPException(status_code=400, detail="Parent page not found")

        # Convert to dict and create page
        new_page = page.model_dump(exclude_none=True)
        created_page = page_db.create_page(new_page)

        return created_page
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Failed to create page: {str(e)}")


@router.put("/{page_id}", response_model=Page)
async def update_page(page_id: str, updates: PageUpdate):
    """Update a page by ID"""
    try:
        # Verify parent exists if parentId is being updated
        if updates.parentId is not None and not page_db.page_exists(updates.parentId):
            raise HTTPException(status_code=400, detail="Parent page not found")

        # Get update data
        update_data = updates.model_dump(exclude_none=True)

        # Update the page
        updated_page = page_db.update_page_by_id(page_id, update_data)

        if updated_page is None:
            raise HTTPException(status_code=404, detail="Page not found")

        return updated_page
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Failed to update page: {str(e)}")


@router.delete("/{page_id}")
async def delete_page(page_id: str):
    """Delete a page by ID"""
    try:
        deleted = page_db.delete_page_by_id(page_id)

        if not deleted:
            raise HTTPException(status_code=404, detail="Page not found")

        return {"message": "Page deleted successfully", "id": page_id}
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Failed to delete page: {str(e)}")


@router.post("/{page_id}/duplicate", response_model=Page, status_code=201)
async def duplicate_page(page_id: str, include_blocks: bool = Query(False)):
    """Duplicate a page by ID"""
    try:
        duplicated_page = page_db.duplicate_page(page_id, include_blocks)

        if duplicated_page is None:
            raise HTTPException(status_code=404, detail="Page not found")

        return duplicated_page
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Failed to duplicate page: {str(e)}")


@router.put("/{page_id}/move", response_model=Page)
async def move_page(page_id: str, new_parent_id: Optional[str] = None):
    """Move a page to a new parent"""
    try:
        # Verify new parent exists if provided
        if new_parent_id is not None and not page_db.page_exists(new_parent_id):
            raise HTTPException(status_code=400, detail="Parent page not found")

        moved_page = page_db.move_page(page_id, new_parent_id)

        if moved_page is None:
            raise HTTPException(status_code=404, detail="Page not found")

        return moved_page
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Failed to move page: {str(e)}")


@router.put("/{page_id}/favorite")
async def toggle_favorite(page_id: str, is_favorite: bool):
    """Toggle favorite status of a page"""
    try:
        updated_page = page_db.update_page_by_id(page_id, {"isFavorite": is_favorite})

        if updated_page is None:
            raise HTTPException(status_code=404, detail="Page not found")

        return {"message": f"Page {'favorited' if is_favorite else 'unfavorited'} successfully", "page": updated_page}
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Failed to toggle favorite: {str(e)}")

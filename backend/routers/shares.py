from fastapi import APIRouter, HTTPException
from typing import List
from collaboration_models import PageShare, PageShareCreate
import collaboration_database as collab_db
import uuid

router = APIRouter(
    prefix="/shares",
    tags=["shares"]
)


@router.get("/pages/{page_id}", response_model=List[PageShare])
async def get_page_shares(page_id: str):
    """Get all shares for a specific page"""
    try:
        shares = collab_db.get_page_shares(page_id)
        return shares
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Failed to fetch shares: {str(e)}")


@router.post("", response_model=PageShare, status_code=201)
async def create_page_share(share: PageShareCreate):
    """Share a page with a user"""
    try:
        # Generate ID
        share_data = share.model_dump(exclude_none=True)
        share_data["id"] = str(uuid.uuid4())

        # Create share
        new_share = collab_db.create_share(share_data)

        # Create activity for the shared user
        if share.userId:
            from collaboration_models import ActivityCreate
            activity_data = ActivityCreate(
                type="page_shared",
                userId=share.userId,
                actorId=share.createdBy,
                pageId=share.pageId,
                content=f"Page shared with {share.role} access"
            ).model_dump(exclude_none=True)
            activity_data["id"] = str(uuid.uuid4())
            collab_db.create_activity(activity_data)

        return new_share
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Failed to create share: {str(e)}")


@router.delete("/{share_id}")
async def delete_share(share_id: str):
    """Remove a page share"""
    try:
        deleted = collab_db.delete_share(share_id)

        if not deleted:
            raise HTTPException(status_code=404, detail="Share not found")

        return {"message": "Share removed successfully", "id": share_id}
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Failed to delete share: {str(e)}")

from fastapi import APIRouter, HTTPException, Query
from typing import List, Optional
from collaboration_models import Comment, CommentCreate, CommentUpdate
import collaboration_database as collab_db
import uuid

router = APIRouter(
    prefix="/comments",
    tags=["comments"]
)


@router.get("", response_model=List[Comment])
async def get_comments(
    block_id: Optional[str] = Query(None, description="Filter by block ID"),
    page_id: Optional[str] = Query(None, description="Filter by page ID (discussions)")
):
    """Get comments, optionally filtered by block or page"""
    try:
        if block_id:
            comments = collab_db.get_comments_by_block(block_id)
        elif page_id:
            comments = collab_db.get_comments_by_page(page_id)
        else:
            comments = collab_db.get_all_comments()

        return comments
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Failed to fetch comments: {str(e)}")


@router.post("", response_model=Comment, status_code=201)
async def create_comment(comment: CommentCreate):
    """Create a new comment"""
    try:
        # Generate ID if not provided
        comment_data = comment.model_dump(exclude_none=True)
        comment_data["id"] = str(uuid.uuid4())

        # Create comment
        new_comment = collab_db.create_comment(comment_data)

        # Create activities for mentions
        if comment.mentions:
            from collaboration_models import ActivityCreate
            for mentioned_user_id in comment.mentions:
                activity_data = ActivityCreate(
                    type="mention",
                    userId=mentioned_user_id,
                    actorId=comment.authorId,
                    pageId=comment.pageId,
                    blockId=comment.blockId,
                    commentId=new_comment["id"],
                    content=comment.content[:100]
                ).model_dump(exclude_none=True)
                activity_data["id"] = str(uuid.uuid4())
                collab_db.create_activity(activity_data)

        # Create activity for comment
        if comment.blockId or comment.pageId:
            from collaboration_models import ActivityCreate
            activity_data = ActivityCreate(
                type="comment",
                userId=comment.authorId,  # For now, notify the author; in real app, notify page owner
                actorId=comment.authorId,
                pageId=comment.pageId,
                blockId=comment.blockId,
                commentId=new_comment["id"],
                content=comment.content[:100]
            ).model_dump(exclude_none=True)
            activity_data["id"] = str(uuid.uuid4())
            collab_db.create_activity(activity_data)

        return new_comment
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Failed to create comment: {str(e)}")


@router.put("/{comment_id}", response_model=Comment)
async def update_comment(comment_id: str, updates: CommentUpdate):
    """Update a comment"""
    try:
        update_data = updates.model_dump(exclude_none=True)
        updated_comment = collab_db.update_comment(comment_id, update_data)

        if updated_comment is None:
            raise HTTPException(status_code=404, detail="Comment not found")

        return updated_comment
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Failed to update comment: {str(e)}")


@router.delete("/{comment_id}")
async def delete_comment(comment_id: str):
    """Delete a comment"""
    try:
        deleted = collab_db.delete_comment(comment_id)

        if not deleted:
            raise HTTPException(status_code=404, detail="Comment not found")

        return {"message": "Comment deleted successfully", "id": comment_id}
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Failed to delete comment: {str(e)}")


@router.put("/{comment_id}/resolve")
async def resolve_comment(comment_id: str):
    """Mark a comment as resolved"""
    try:
        updated_comment = collab_db.update_comment(comment_id, {"resolved": True})

        if updated_comment is None:
            raise HTTPException(status_code=404, detail="Comment not found")

        return {"message": "Comment resolved successfully", "comment": updated_comment}
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Failed to resolve comment: {str(e)}")

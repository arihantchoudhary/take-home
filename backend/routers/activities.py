from fastapi import APIRouter, HTTPException, Query
from typing import List
from collaboration_models import Activity
import collaboration_database as collab_db

router = APIRouter(
    prefix="/activities",
    tags=["activities"]
)


@router.get("/{user_id}", response_model=List[Activity])
async def get_user_activities(
    user_id: str,
    unread_only: bool = Query(False, description="Only return unread activities")
):
    """Get all activities for a specific user"""
    try:
        activities = collab_db.get_user_activities(user_id, unread_only)
        return activities
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Failed to fetch activities: {str(e)}")


@router.put("/{activity_id}/read")
async def mark_activity_read(activity_id: str):
    """Mark an activity as read"""
    try:
        updated_activity = collab_db.mark_activity_read(activity_id)

        if updated_activity is None:
            raise HTTPException(status_code=404, detail="Activity not found")

        return {"message": "Activity marked as read", "activity": updated_activity}
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Failed to mark activity as read: {str(e)}")


@router.put("/users/{user_id}/read-all")
async def mark_all_activities_read(user_id: str):
    """Mark all activities for a user as read"""
    try:
        count = collab_db.mark_all_activities_read(user_id)
        return {"message": f"Marked {count} activities as read", "count": count}
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Failed to mark activities as read: {str(e)}")

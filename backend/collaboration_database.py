import json
from pathlib import Path
from typing import List
from datetime import datetime


# Data file paths
DATA_DIR = Path(__file__).parent.parent / "my-app" / "data"
COMMENTS_FILE = DATA_DIR / "comments.json"
SHARES_FILE = DATA_DIR / "shares.json"
ACTIVITIES_FILE = DATA_DIR / "activities.json"
USERS_FILE = DATA_DIR / "users.json"


def ensure_file(file_path: Path):
    """Ensure data directory and file exist"""
    DATA_DIR.mkdir(parents=True, exist_ok=True)
    if not file_path.exists():
        file_path.write_text("[]", encoding="utf-8")


# Comments operations
def read_comments() -> List[dict]:
    """Read comments from JSON file"""
    ensure_file(COMMENTS_FILE)
    with open(COMMENTS_FILE, "r", encoding="utf-8") as f:
        return json.load(f)


def write_comments(comments: List[dict]):
    """Write comments to JSON file"""
    ensure_file(COMMENTS_FILE)
    with open(COMMENTS_FILE, "w", encoding="utf-8") as f:
        json.dump(comments, f, indent=2, ensure_ascii=False)


def get_all_comments() -> List[dict]:
    """Get all comments"""
    return read_comments()


def get_comments_by_block(block_id: str) -> List[dict]:
    """Get all comments for a specific block"""
    comments = read_comments()
    return [c for c in comments if c.get("blockId") == block_id and not c.get("resolved")]


def get_comments_by_page(page_id: str) -> List[dict]:
    """Get all page-level comments (discussions)"""
    comments = read_comments()
    return [c for c in comments if c.get("pageId") == page_id and not c.get("blockId")]


def create_comment(comment_data: dict) -> dict:
    """Create a new comment"""
    comments = read_comments()

    # Add timestamps
    now = datetime.utcnow().isoformat()
    comment_data["createdAt"] = now
    comment_data["updatedAt"] = now

    comments.append(comment_data)
    write_comments(comments)
    return comment_data


def update_comment(comment_id: str, updates: dict) -> dict | None:
    """Update a comment"""
    comments = read_comments()

    for i, comment in enumerate(comments):
        if comment["id"] == comment_id:
            updates["updatedAt"] = datetime.utcnow().isoformat()
            comments[i].update(updates)
            write_comments(comments)
            return comments[i]

    return None


def delete_comment(comment_id: str) -> bool:
    """Delete a comment"""
    comments = read_comments()
    original_length = len(comments)
    comments = [c for c in comments if c["id"] != comment_id]

    if len(comments) == original_length:
        return False

    write_comments(comments)
    return True


# Shares operations
def read_shares() -> List[dict]:
    """Read shares from JSON file"""
    ensure_file(SHARES_FILE)
    with open(SHARES_FILE, "r", encoding="utf-8") as f:
        return json.load(f)


def write_shares(shares: List[dict]):
    """Write shares to JSON file"""
    ensure_file(SHARES_FILE)
    with open(SHARES_FILE, "w", encoding="utf-8") as f:
        json.dump(shares, f, indent=2, ensure_ascii=False)


def get_page_shares(page_id: str) -> List[dict]:
    """Get all shares for a specific page"""
    shares = read_shares()
    return [s for s in shares if s.get("pageId") == page_id]


def create_share(share_data: dict) -> dict:
    """Create a new page share"""
    shares = read_shares()

    # Add timestamp
    share_data["createdAt"] = datetime.utcnow().isoformat()

    shares.append(share_data)
    write_shares(shares)
    return share_data


def delete_share(share_id: str) -> bool:
    """Delete a page share"""
    shares = read_shares()
    original_length = len(shares)
    shares = [s for s in shares if s["id"] != share_id]

    if len(shares) == original_length:
        return False

    write_shares(shares)
    return True


# Activities operations
def read_activities() -> List[dict]:
    """Read activities from JSON file"""
    ensure_file(ACTIVITIES_FILE)
    with open(ACTIVITIES_FILE, "r", encoding="utf-8") as f:
        return json.load(f)


def write_activities(activities: List[dict]):
    """Write activities to JSON file"""
    ensure_file(ACTIVITIES_FILE)
    with open(ACTIVITIES_FILE, "w", encoding="utf-8") as f:
        json.dump(activities, f, indent=2, ensure_ascii=False)


def get_user_activities(user_id: str, unread_only: bool = False) -> List[dict]:
    """Get all activities for a specific user"""
    activities = read_activities()
    user_activities = [a for a in activities if a.get("userId") == user_id]

    if unread_only:
        user_activities = [a for a in user_activities if not a.get("read")]

    # Sort by created date, newest first
    user_activities.sort(key=lambda x: x.get("createdAt", ""), reverse=True)
    return user_activities


def create_activity(activity_data: dict) -> dict:
    """Create a new activity"""
    activities = read_activities()

    # Add timestamp
    activity_data["createdAt"] = datetime.utcnow().isoformat()
    activity_data["read"] = False

    activities.append(activity_data)
    write_activities(activities)
    return activity_data


def mark_activity_read(activity_id: str) -> dict | None:
    """Mark an activity as read"""
    activities = read_activities()

    for i, activity in enumerate(activities):
        if activity["id"] == activity_id:
            activities[i]["read"] = True
            write_activities(activities)
            return activities[i]

    return None


def mark_all_activities_read(user_id: str) -> int:
    """Mark all activities for a user as read"""
    activities = read_activities()
    count = 0

    for i, activity in enumerate(activities):
        if activity.get("userId") == user_id and not activity.get("read"):
            activities[i]["read"] = True
            count += 1

    if count > 0:
        write_activities(activities)

    return count


# Users operations
def read_users() -> List[dict]:
    """Read users from JSON file"""
    ensure_file(USERS_FILE)
    with open(USERS_FILE, "r", encoding="utf-8") as f:
        return json.load(f)


def write_users(users: List[dict]):
    """Write users to JSON file"""
    ensure_file(USERS_FILE)
    with open(USERS_FILE, "w", encoding="utf-8") as f:
        json.dump(users, f, indent=2, ensure_ascii=False)


def get_user_by_id(user_id: str) -> dict | None:
    """Get a user by ID"""
    users = read_users()
    for user in users:
        if user["id"] == user_id:
            return user
    return None


def create_user(user_data: dict) -> dict:
    """Create a new user"""
    users = read_users()
    users.append(user_data)
    write_users(users)
    return user_data

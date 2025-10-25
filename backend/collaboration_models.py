from pydantic import BaseModel
from typing import Optional, List, Literal


class User(BaseModel):
    id: str
    name: str
    email: str
    avatar: Optional[str] = None


class Comment(BaseModel):
    id: str
    blockId: Optional[str] = None  # Block being commented on
    pageId: Optional[str] = None   # Page being commented on (for discussions)
    content: str
    authorId: str
    mentions: List[str] = []  # List of user IDs mentioned
    resolved: bool = False
    createdAt: str
    updatedAt: str
    parentId: Optional[str] = None  # For threaded comments


class CommentCreate(BaseModel):
    blockId: Optional[str] = None
    pageId: Optional[str] = None
    content: str
    authorId: str
    mentions: List[str] = []
    parentId: Optional[str] = None


class CommentUpdate(BaseModel):
    content: Optional[str] = None
    resolved: Optional[bool] = None


class PageShare(BaseModel):
    id: str
    pageId: str
    userId: Optional[str] = None  # Specific user (for guest access)
    role: Literal["viewer", "editor", "admin"]
    createdAt: str
    createdBy: str


class PageShareCreate(BaseModel):
    pageId: str
    userId: Optional[str] = None
    role: Literal["viewer", "editor", "admin"] = "viewer"
    createdBy: str


class Activity(BaseModel):
    id: str
    type: Literal["comment", "mention", "page_shared", "page_updated", "page_created"]
    userId: str  # User this activity is for
    actorId: str  # User who performed the action
    pageId: Optional[str] = None
    blockId: Optional[str] = None
    commentId: Optional[str] = None
    content: Optional[str] = None
    read: bool = False
    createdAt: str


class ActivityCreate(BaseModel):
    type: Literal["comment", "mention", "page_shared", "page_updated", "page_created"]
    userId: str
    actorId: str
    pageId: Optional[str] = None
    blockId: Optional[str] = None
    commentId: Optional[str] = None
    content: Optional[str] = None

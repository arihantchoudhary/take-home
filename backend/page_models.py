from pydantic import BaseModel
from typing import Optional, List
from datetime import datetime


class Page(BaseModel):
    id: str
    title: str
    icon: Optional[str] = None
    cover: Optional[str] = None
    parentId: Optional[str] = None  # ID of parent page
    blockIds: List[str] = []  # Ordered list of block IDs on this page
    isFavorite: bool = False
    isPrivate: bool = False
    createdAt: str
    updatedAt: str
    createdBy: Optional[str] = None  # User ID who created it



class PageCreate(BaseModel):
    id: str
    title: str
    icon: Optional[str] = None
    cover: Optional[str] = None
    parentId: Optional[str] = None
    blockIds: List[str] = []
    isFavorite: bool = False
    isPrivate: bool = False
    createdBy: Optional[str] = None


class PageUpdate(BaseModel):
    title: Optional[str] = None
    icon: Optional[str] = None
    cover: Optional[str] = None
    parentId: Optional[str] = None
    blockIds: Optional[List[str]] = None
    isFavorite: Optional[bool] = None
    isPrivate: Optional[bool] = None

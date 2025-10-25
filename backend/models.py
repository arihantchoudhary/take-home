from pydantic import BaseModel
from typing import Literal, Optional


class TextBlock(BaseModel):
    id: str
    type: Literal["text"]
    textType: Literal["h1", "h2", "h3", "paragraph"]
    value: str
    color: Optional[str] = None
    backgroundColor: Optional[str] = None


class TodoBlock(BaseModel):
    id: str
    type: Literal["todo"]
    value: str
    checked: bool = False
    color: Optional[str] = None


class BulletListBlock(BaseModel):
    id: str
    type: Literal["bullet"]
    value: str
    color: Optional[str] = None


class NumberedListBlock(BaseModel):
    id: str
    type: Literal["numbered"]
    value: str
    color: Optional[str] = None


class QuoteBlock(BaseModel):
    id: str
    type: Literal["quote"]
    value: str
    color: Optional[str] = None


class CodeBlock(BaseModel):
    id: str
    type: Literal["code"]
    value: str
    language: Optional[str] = "plaintext"


class DividerBlock(BaseModel):
    id: str
    type: Literal["divider"]


class ImageBlock(BaseModel):
    id: str
    type: Literal["image"]
    src: str
    width: int
    height: int
    alt: Optional[str] = None


class VideoBlock(BaseModel):
    id: str
    type: Literal["video"]
    src: str
    width: Optional[int] = None
    height: Optional[int] = None


class BlockCreate(BaseModel):
    id: str
    type: Literal["text", "todo", "bullet", "numbered", "quote", "code", "divider", "image", "video"]
    # Text block fields
    textType: Literal["h1", "h2", "h3", "paragraph"] | None = None
    value: str | None = None
    color: str | None = None
    backgroundColor: str | None = None
    # Todo block fields
    checked: bool | None = None
    # Code block fields
    language: str | None = None
    # Image/Video block fields
    src: str | None = None
    width: int | None = None
    height: int | None = None
    alt: str | None = None


class BlockUpdate(BaseModel):
    textType: Literal["h1", "h2", "h3", "paragraph"] | None = None
    value: str | None = None
    color: str | None = None
    backgroundColor: str | None = None
    checked: bool | None = None
    language: str | None = None
    src: str | None = None
    width: int | None = None
    height: int | None = None
    alt: str | None = None

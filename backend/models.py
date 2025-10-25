from pydantic import BaseModel
from typing import Literal


class TextBlock(BaseModel):
    id: str
    type: Literal["text"]
    textType: Literal["h1", "h2", "h3", "paragraph"]
    value: str


class ImageBlock(BaseModel):
    id: str
    type: Literal["image"]
    src: str
    width: int
    height: int


class BlockCreate(BaseModel):
    id: str
    type: Literal["text", "image"]
    textType: Literal["h1", "h2", "h3", "paragraph"] | None = None
    value: str | None = None
    src: str | None = None
    width: int | None = None
    height: int | None = None


class BlockUpdate(BaseModel):
    textType: Literal["h1", "h2", "h3", "paragraph"] | None = None
    value: str | None = None
    src: str | None = None
    width: int | None = None
    height: int | None = None

from fastapi import APIRouter, Query
from typing import List, Literal
from pydantic import BaseModel
import page_database as page_db
import database as db

router = APIRouter(
    prefix="/search",
    tags=["search"]
)


class SearchResult(BaseModel):
    id: str
    type: Literal["page", "block"]
    title: str | None = None
    content: str | None = None
    pageId: str | None = None
    parentId: str | None = None
    highlight: str | None = None


@router.get("", response_model=List[SearchResult])
async def search(
    q: str = Query(..., description="Search query"),
    type: Literal["all", "page", "block"] | None = Query("all", description="Type of content to search")
):
    """Search across pages and blocks"""
    results = []
    query_lower = q.lower()

    # Search pages
    if type in ["all", "page"]:
        pages = page_db.get_all_pages()
        for page in pages:
            title = page.get("title", "")
            if query_lower in title.lower():
                results.append({
                    "id": page["id"],
                    "type": "page",
                    "title": title,
                    "content": None,
                    "pageId": None,
                    "parentId": page.get("parentId"),
                    "highlight": title
                })

    # Search blocks
    if type in ["all", "block"]:
        blocks = db.get_all_blocks()
        for block in blocks:
            value = block.get("value", "")
            if query_lower in value.lower():
                # Find which page this block belongs to
                page_id = None
                pages = page_db.get_all_pages()
                for page in pages:
                    if block["id"] in page.get("blockIds", []):
                        page_id = page["id"]
                        break

                results.append({
                    "id": block["id"],
                    "type": "block",
                    "title": None,
                    "content": value[:200],  # Limit content preview
                    "pageId": page_id,
                    "parentId": None,
                    "highlight": _get_highlight(value, query_lower)
                })

    return results


def _get_highlight(text: str, query: str, context_chars: int = 50) -> str:
    """Extract a highlighted snippet of text around the query"""
    text_lower = text.lower()
    index = text_lower.find(query)

    if index == -1:
        return text[:100]

    start = max(0, index - context_chars)
    end = min(len(text), index + len(query) + context_chars)

    snippet = text[start:end]
    if start > 0:
        snippet = "..." + snippet
    if end < len(text):
        snippet = snippet + "..."

    return snippet

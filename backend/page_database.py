import json
from pathlib import Path
from typing import List
from datetime import datetime


# Data file path
DATA_DIR = Path(__file__).parent.parent / "my-app" / "data"
PAGES_FILE = DATA_DIR / "pages.json"


def ensure_pages_file():
    """Ensure data directory and pages file exist"""
    DATA_DIR.mkdir(parents=True, exist_ok=True)
    if not PAGES_FILE.exists():
        PAGES_FILE.write_text("[]", encoding="utf-8")


def read_pages() -> List[dict]:
    """Read pages from JSON file"""
    ensure_pages_file()
    with open(PAGES_FILE, "r", encoding="utf-8") as f:
        return json.load(f)


def write_pages(pages: List[dict]):
    """Write pages to JSON file"""
    ensure_pages_file()
    with open(PAGES_FILE, "w", encoding="utf-8") as f:
        json.dump(pages, f, indent=2, ensure_ascii=False)


def get_all_pages() -> List[dict]:
    """Get all pages"""
    return read_pages()


def get_page_by_id(page_id: str) -> dict | None:
    """Get a specific page by ID"""
    pages = read_pages()
    for page in pages:
        if page["id"] == page_id:
            return page
    return None


def create_page(page_data: dict) -> dict:
    """Create a new page"""
    pages = read_pages()

    # Add timestamps
    now = datetime.utcnow().isoformat()
    page_data["createdAt"] = now
    page_data["updatedAt"] = now

    pages.append(page_data)
    write_pages(pages)
    return page_data


def update_page_by_id(page_id: str, updates: dict) -> dict | None:
    """Update a page by ID"""
    pages = read_pages()

    for i, page in enumerate(pages):
        if page["id"] == page_id:
            # Update timestamp
            updates["updatedAt"] = datetime.utcnow().isoformat()
            pages[i].update(updates)
            write_pages(pages)
            return pages[i]

    return None


def delete_page_by_id(page_id: str) -> bool:
    """Delete a page by ID"""
    pages = read_pages()
    original_length = len(pages)

    # Also remove this page as parent from any child pages
    for page in pages:
        if page.get("parentId") == page_id:
            page["parentId"] = None

    pages = [p for p in pages if p["id"] != page_id]

    if len(pages) == original_length:
        return False

    write_pages(pages)
    return True


def page_exists(page_id: str) -> bool:
    """Check if a page with given ID exists"""
    pages = read_pages()
    return any(p["id"] == page_id for p in pages)


def get_child_pages(page_id: str) -> List[dict]:
    """Get all child pages of a given page"""
    pages = read_pages()
    return [p for p in pages if p.get("parentId") == page_id]


def get_root_pages() -> List[dict]:
    """Get all root pages (pages without a parent)"""
    pages = read_pages()
    return [p for p in pages if not p.get("parentId")]


def get_favorite_pages() -> List[dict]:
    """Get all favorite pages"""
    pages = read_pages()
    return [p for p in pages if p.get("isFavorite")]


def get_private_pages() -> List[dict]:
    """Get all private pages"""
    pages = read_pages()
    return [p for p in pages if p.get("isPrivate")]


def get_workspace_pages() -> List[dict]:
    """Get all workspace (non-private) pages"""
    pages = read_pages()
    return [p for p in pages if not p.get("isPrivate")]


def move_page(page_id: str, new_parent_id: str | None) -> dict | None:
    """Move a page to a new parent"""
    pages = read_pages()

    for i, page in enumerate(pages):
        if page["id"] == page_id:
            pages[i]["parentId"] = new_parent_id
            pages[i]["updatedAt"] = datetime.utcnow().isoformat()
            write_pages(pages)
            return pages[i]

    return None


def duplicate_page(page_id: str, include_blocks: bool = False) -> dict | None:
    """Duplicate a page"""
    import uuid
    pages = read_pages()

    for i, page in enumerate(pages):
        if page["id"] == page_id:
            # Create a copy with a new ID
            duplicated = page.copy()
            duplicated["id"] = str(uuid.uuid4())
            duplicated["title"] = f"{page['title']} (Copy)"

            # Reset timestamps
            now = datetime.utcnow().isoformat()
            duplicated["createdAt"] = now
            duplicated["updatedAt"] = now

            # If not including blocks, clear block IDs
            if not include_blocks:
                duplicated["blockIds"] = []

            # Insert the duplicated page right after the original
            pages.insert(i + 1, duplicated)
            write_pages(pages)
            return duplicated

    return None

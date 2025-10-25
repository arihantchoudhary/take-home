import json
from pathlib import Path
from typing import List


# Data file path
DATA_DIR = Path(__file__).parent.parent / "my-app" / "data"
DATA_FILE = DATA_DIR / "blocks.json"


def ensure_data_file():
    """Ensure data directory and file exist"""
    DATA_DIR.mkdir(parents=True, exist_ok=True)
    if not DATA_FILE.exists():
        DATA_FILE.write_text("[]", encoding="utf-8")


def read_blocks() -> List[dict]:
    """Read blocks from JSON file"""
    ensure_data_file()
    with open(DATA_FILE, "r", encoding="utf-8") as f:
        return json.load(f)


def write_blocks(blocks: List[dict]):
    """Write blocks to JSON file"""
    ensure_data_file()
    with open(DATA_FILE, "w", encoding="utf-8") as f:
        json.dump(blocks, f, indent=2, ensure_ascii=False)


def get_all_blocks() -> List[dict]:
    """Get all blocks"""
    return read_blocks()


def get_block_by_id(block_id: str) -> dict | None:
    """Get a specific block by ID"""
    blocks = read_blocks()
    for block in blocks:
        if block["id"] == block_id:
            return block
    return None


def create_block(block_data: dict) -> dict:
    """Create a new block"""
    blocks = read_blocks()
    blocks.append(block_data)
    write_blocks(blocks)
    return block_data


def update_block_by_id(block_id: str, updates: dict) -> dict | None:
    """Update a block by ID"""
    blocks = read_blocks()

    for i, block in enumerate(blocks):
        if block["id"] == block_id:
            blocks[i].update(updates)
            write_blocks(blocks)
            return blocks[i]

    return None


def delete_block_by_id(block_id: str) -> bool:
    """Delete a block by ID"""
    blocks = read_blocks()
    original_length = len(blocks)
    blocks = [b for b in blocks if b["id"] != block_id]

    if len(blocks) == original_length:
        return False

    write_blocks(blocks)
    return True


def block_exists(block_id: str) -> bool:
    """Check if a block with given ID exists"""
    blocks = read_blocks()
    return any(b["id"] == block_id for b in blocks)

import fs from 'fs/promises';
import path from 'path';
import { Block, BlocksData } from './types';

const DATA_FILE = path.join(__dirname, '../data/blocks.json');

// Initialize data file if it doesn't exist
async function initializeDataFile(): Promise<void> {
  try {
    await fs.access(DATA_FILE);
  } catch {
    // File doesn't exist, create directory and file with empty blocks array
    const dataDir = path.dirname(DATA_FILE);
    await fs.mkdir(dataDir, { recursive: true });
    const initialData: BlocksData = { blocks: [] };
    await fs.writeFile(DATA_FILE, JSON.stringify(initialData, null, 2));
  }
}

// Read all blocks
export async function getAllBlocks(): Promise<Block[]> {
  await initializeDataFile();
  const data = await fs.readFile(DATA_FILE, 'utf-8');
  const blocksData: BlocksData = JSON.parse(data);
  return blocksData.blocks;
}

// Save all blocks
export async function saveBlocks(blocks: Block[]): Promise<void> {
  const dataDir = path.dirname(DATA_FILE);
  await fs.mkdir(dataDir, { recursive: true });
  const blocksData: BlocksData = { blocks };
  await fs.writeFile(DATA_FILE, JSON.stringify(blocksData, null, 2));
}

// Get a single block by ID
export async function getBlockById(id: string): Promise<Block | undefined> {
  const blocks = await getAllBlocks();
  return blocks.find(block => block.id === id);
}

// Add a new block
export async function addBlock(block: Block): Promise<Block> {
  const blocks = await getAllBlocks();
  blocks.push(block);
  await saveBlocks(blocks);
  return block;
}

// Update an existing block
export async function updateBlock(id: string, updatedBlock: Block): Promise<Block | null> {
  const blocks = await getAllBlocks();
  const index = blocks.findIndex(block => block.id === id);

  if (index === -1) {
    return null;
  }

  blocks[index] = { ...updatedBlock, id };
  await saveBlocks(blocks);
  return blocks[index];
}

// Delete a block
export async function deleteBlock(id: string): Promise<boolean> {
  const blocks = await getAllBlocks();
  const filteredBlocks = blocks.filter(block => block.id !== id);

  if (filteredBlocks.length === blocks.length) {
    return false; // Block not found
  }

  await saveBlocks(filteredBlocks);
  return true;
}

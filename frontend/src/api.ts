import { Block } from './types';

const API_BASE_URL = 'http://localhost:3001/api';

export async function fetchBlocks(): Promise<Block[]> {
  const response = await fetch(`${API_BASE_URL}/blocks`);
  if (!response.ok) {
    throw new Error('Failed to fetch blocks');
  }
  return response.json();
}

export async function createBlock(block: Block): Promise<Block> {
  const response = await fetch(`${API_BASE_URL}/blocks`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(block),
  });
  if (!response.ok) {
    throw new Error('Failed to create block');
  }
  return response.json();
}

export async function updateBlock(id: string, block: Block): Promise<Block> {
  const response = await fetch(`${API_BASE_URL}/blocks/${id}`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(block),
  });
  if (!response.ok) {
    throw new Error('Failed to update block');
  }
  return response.json();
}

export async function deleteBlock(id: string): Promise<void> {
  const response = await fetch(`${API_BASE_URL}/blocks/${id}`, {
    method: 'DELETE',
  });
  if (!response.ok) {
    throw new Error('Failed to delete block');
  }
}

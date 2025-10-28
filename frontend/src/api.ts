import type { Block } from './types';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001/api';


export async function fetchBlocks(): Promise<Block[]> {

  try {
    const response = await fetch(`${API_BASE_URL}/blocks`);

    if (!response.ok) {
      console.error('[API] ❌ FETCH BLOCKS FAILED - Bad response');
      throw new Error('Failed to fetch blocks');
    }

    const data = await response.json();

    return data;
  } catch (error) {
    console.error('[API] ❌ FETCH BLOCKS ERROR:', error);
    throw error;
  }
}

export async function createBlock(block: Block): Promise<Block> {

  try {
    const payload = JSON.stringify(block);

    const response = await fetch(`${API_BASE_URL}/blocks`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: payload,
    });


    if (!response.ok) {
      const errorText = await response.text();
      console.error('[API] ❌ CREATE BLOCK FAILED');
      console.error('[API] 📄 Error response:', errorText);
      throw new Error('Failed to create block');
    }

    const data = await response.json();

    return data;
  } catch (error) {
    console.error('[API] ❌ CREATE BLOCK ERROR:', error);
    throw error;
  }
}

export async function updateBlock(id: string, block: Block): Promise<Block> {

  try {
    const payload = JSON.stringify(block);

    const response = await fetch(`${API_BASE_URL}/blocks/${id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: payload,
    });


    if (!response.ok) {
      const errorText = await response.text();
      console.error('[API] ❌ UPDATE BLOCK FAILED');
      console.error('[API] 📄 Error response:', errorText);
      throw new Error('Failed to update block');
    }

    const data = await response.json();

    return data;
  } catch (error) {
    console.error('[API] ❌ UPDATE BLOCK ERROR:', error);
    throw error;
  }
}

export async function deleteBlock(id: string): Promise<void> {

  try {
    const response = await fetch(`${API_BASE_URL}/blocks/${id}`, {
      method: 'DELETE',
    });


    if (!response.ok) {
      const errorText = await response.text();
      console.error('[API] ❌ DELETE BLOCK FAILED');
      console.error('[API] 📄 Error response:', errorText);
      throw new Error('Failed to delete block');
    }

  } catch (error) {
    console.error('[API] ❌ DELETE BLOCK ERROR:', error);
    throw error;
  }
}

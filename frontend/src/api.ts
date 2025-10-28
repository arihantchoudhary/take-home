import type { Block } from './types';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001/api';

console.log('[API] 🚀 API Module Initialized');
console.log('[API] 📍 Base URL:', API_BASE_URL);

export async function fetchBlocks(): Promise<Block[]> {
  console.log('[API] 📥 FETCH BLOCKS - Starting request');
  console.log('[API] 🔗 URL:', `${API_BASE_URL}/blocks`);

  try {
    const response = await fetch(`${API_BASE_URL}/blocks`);
    console.log('[API] 📡 Response status:', response.status);
    console.log('[API] 📡 Response OK:', response.ok);

    if (!response.ok) {
      console.error('[API] ❌ FETCH BLOCKS FAILED - Bad response');
      throw new Error('Failed to fetch blocks');
    }

    const data = await response.json();
    console.log('[API] ✅ FETCH BLOCKS SUCCESS');
    console.log('[API] 📦 Retrieved blocks:', data);
    console.log('[API] 📊 Block count:', data.length);

    return data;
  } catch (error) {
    console.error('[API] ❌ FETCH BLOCKS ERROR:', error);
    throw error;
  }
}

export async function createBlock(block: Block): Promise<Block> {
  console.log('[API] 📤 CREATE BLOCK - Starting request');
  console.log('[API] 🔗 URL:', `${API_BASE_URL}/blocks`);
  console.log('[API] 📝 Block data being sent:', block);
  console.log('[API] 📋 Block type:', block.type);
  console.log('[API] 📋 Block ID:', block.id);

  try {
    const payload = JSON.stringify(block);
    console.log('[API] 📦 JSON payload:', payload);

    const response = await fetch(`${API_BASE_URL}/blocks`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: payload,
    });

    console.log('[API] 📡 Response status:', response.status);
    console.log('[API] 📡 Response OK:', response.ok);

    if (!response.ok) {
      const errorText = await response.text();
      console.error('[API] ❌ CREATE BLOCK FAILED');
      console.error('[API] 📄 Error response:', errorText);
      throw new Error('Failed to create block');
    }

    const data = await response.json();
    console.log('[API] ✅ CREATE BLOCK SUCCESS');
    console.log('[API] 📦 Created block:', data);

    return data;
  } catch (error) {
    console.error('[API] ❌ CREATE BLOCK ERROR:', error);
    throw error;
  }
}

export async function updateBlock(id: string, block: Block): Promise<Block> {
  console.log('[API] 🔄 UPDATE BLOCK - Starting request');
  console.log('[API] 🔗 URL:', `${API_BASE_URL}/blocks/${id}`);
  console.log('[API] 🆔 Block ID:', id);
  console.log('[API] 📝 Updated block data:', block);

  try {
    const payload = JSON.stringify(block);
    console.log('[API] 📦 JSON payload:', payload);

    const response = await fetch(`${API_BASE_URL}/blocks/${id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: payload,
    });

    console.log('[API] 📡 Response status:', response.status);
    console.log('[API] 📡 Response OK:', response.ok);

    if (!response.ok) {
      const errorText = await response.text();
      console.error('[API] ❌ UPDATE BLOCK FAILED');
      console.error('[API] 📄 Error response:', errorText);
      throw new Error('Failed to update block');
    }

    const data = await response.json();
    console.log('[API] ✅ UPDATE BLOCK SUCCESS');
    console.log('[API] 📦 Updated block:', data);

    return data;
  } catch (error) {
    console.error('[API] ❌ UPDATE BLOCK ERROR:', error);
    throw error;
  }
}

export async function deleteBlock(id: string): Promise<void> {
  console.log('[API] 🗑️  DELETE BLOCK - Starting request');
  console.log('[API] 🔗 URL:', `${API_BASE_URL}/blocks/${id}`);
  console.log('[API] 🆔 Block ID:', id);

  try {
    const response = await fetch(`${API_BASE_URL}/blocks/${id}`, {
      method: 'DELETE',
    });

    console.log('[API] 📡 Response status:', response.status);
    console.log('[API] 📡 Response OK:', response.ok);

    if (!response.ok) {
      const errorText = await response.text();
      console.error('[API] ❌ DELETE BLOCK FAILED');
      console.error('[API] 📄 Error response:', errorText);
      throw new Error('Failed to delete block');
    }

    console.log('[API] ✅ DELETE BLOCK SUCCESS');
  } catch (error) {
    console.error('[API] ❌ DELETE BLOCK ERROR:', error);
    throw error;
  }
}

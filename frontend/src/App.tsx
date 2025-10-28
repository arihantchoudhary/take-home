import { useState, useEffect } from 'react';
import type { Block } from './types';
import { BlockRenderer } from './components/BlockRenderer';
import { BlockEditor } from './components/BlockEditor';
import * as api from './api';
import './App.css';

function App() {
  const [blocks, setBlocks] = useState<Block[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isEditorOpen, setIsEditorOpen] = useState(false);
  const [editingBlock, setEditingBlock] = useState<Block | undefined>(undefined);

  // Load blocks on mount
  useEffect(() => {
    loadBlocks();
  }, []);

  const loadBlocks = async () => {
    try {
      setLoading(true);
      setError(null);
      const fetchedBlocks = await api.fetchBlocks();
      setBlocks(fetchedBlocks);
    } catch (err) {
      setError('Failed to load blocks. Make sure the backend server is running.');
      console.error('Error loading blocks:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleAddBlock = () => {
    setEditingBlock(undefined);
    setIsEditorOpen(true);
  };

  const handleEditBlock = (block: Block) => {
    setEditingBlock(block);
    setIsEditorOpen(true);
  };

  const handleSaveBlock = async (block: Block) => {
    try {
      if (editingBlock) {
        // Update existing block
        await api.updateBlock(block.id, block);
      } else {
        // Create new block
        await api.createBlock(block);
      }
      await loadBlocks();
      setIsEditorOpen(false);
      setEditingBlock(undefined);
    } catch (err) {
      alert('Failed to save block');
      console.error('Error saving block:', err);
    }
  };

  const handleDeleteBlock = async (id: string) => {
    if (!confirm('Are you sure you want to delete this block?')) {
      return;
    }

    try {
      await api.deleteBlock(id);
      await loadBlocks();
    } catch (err) {
      alert('Failed to delete block');
      console.error('Error deleting block:', err);
    }
  };

  if (loading) {
    return (
      <div style={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        height: '100vh'
      }}>
        <p>Loading blocks...</p>
      </div>
    );
  }

  return (
    <div className="app">
      <header style={{
        padding: '20px',
        borderBottom: '1px solid #eee',
        marginBottom: '20px',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
      }}>
        <h1 style={{ margin: 0, fontSize: '24px' }}>Simple Notion Clone</h1>
        <button
          onClick={handleAddBlock}
          style={{
            padding: '10px 20px',
            fontSize: '14px',
            backgroundColor: '#0066ff',
            color: 'white',
            border: 'none',
            borderRadius: '4px',
            cursor: 'pointer',
            fontWeight: 'bold',
          }}
        >
          + Add Block
        </button>
      </header>

      <main style={{
        maxWidth: '800px',
        margin: '0 auto',
        padding: '0 20px',
      }}>
        {error && (
          <div style={{
            padding: '16px',
            backgroundColor: '#fee',
            border: '1px solid #fcc',
            borderRadius: '4px',
            color: '#c00',
            marginBottom: '20px',
          }}>
            {error}
          </div>
        )}

        {blocks.length === 0 ? (
          <div style={{
            textAlign: 'center',
            padding: '60px 20px',
            color: '#999',
          }}>
            <p style={{ fontSize: '18px', marginBottom: '12px' }}>
              No blocks yet
            </p>
            <p style={{ fontSize: '14px' }}>
              Click "Add Block" to create your first text or image block
            </p>
          </div>
        ) : (
          <div className="blocks-container">
            {blocks.map((block) => (
              <BlockRenderer
                key={block.id}
                block={block}
                onEdit={handleEditBlock}
                onDelete={handleDeleteBlock}
              />
            ))}
          </div>
        )}
      </main>

      {isEditorOpen && (
        <BlockEditor
          block={editingBlock}
          onSave={handleSaveBlock}
          onCancel={() => {
            setIsEditorOpen(false);
            setEditingBlock(undefined);
          }}
        />
      )}
    </div>
  );
}

export default App;

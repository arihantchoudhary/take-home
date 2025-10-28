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
      setError('Failed to load blocks');
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
        await api.updateBlock(block.id, block);
      } else {
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
    if (!confirm('Delete this block?')) return;
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
      <div className="loading-container">
        <div className="loading-spinner"></div>
      </div>
    );
  }

  return (
    <div className="app">
      {/* Top bar */}
      <div className="top-bar">
        <div className="top-bar-content">
          <div className="page-title">Untitled</div>
        </div>
      </div>

      {/* Main content */}
      <div className="page-container">
        <div className="page-content">
          {/* Error message */}
          {error && (
            <div style={{
              padding: '12px 16px',
              marginBottom: '16px',
              background: '#fee',
              border: '1px solid #fcc',
              borderRadius: '4px',
              color: '#c00',
              fontSize: '14px'
            }}>
              {error}
            </div>
          )}

          {/* Page icon and title */}
          <div className="page-header">
            <div className="page-icon">📄</div>
            <h1 className="page-title-large" contentEditable suppressContentEditableWarning>
              Untitled
            </h1>
          </div>

          {/* Blocks */}
          <div className="blocks-list">
            {blocks.map((block) => (
              <BlockRenderer
                key={block.id}
                block={block}
                onEdit={handleEditBlock}
                onDelete={handleDeleteBlock}
              />
            ))}

            {/* Add block button */}
            <div className="add-block-container">
              <button className="add-block-btn" onClick={handleAddBlock}>
                <span className="plus-icon">+</span>
                <span className="add-block-text">Click to add a block</span>
              </button>
            </div>

            {/* Empty state */}
            {blocks.length === 0 && (
              <div className="empty-state">
                <p className="empty-state-text">Start writing or press / for commands</p>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Editor modal */}
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

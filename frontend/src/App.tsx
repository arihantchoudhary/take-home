import { useState, useEffect } from 'react';
import type { Block } from './types';
import { BlockRenderer } from './components/BlockRenderer';
import * as api from './api';
import './App.css';

console.log('[APP] 🚀 App Component Loaded');

function App() {
  console.log('[APP] 🔄 App Component Rendering');

  const [blocks, setBlocks] = useState<Block[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [pageTitle, setPageTitle] = useState('Untitled');
  const [pageIcon, setPageIcon] = useState('📄');
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);

  useEffect(() => {
    console.log('[APP] 🎬 useEffect - Component mounted, loading blocks');
    loadBlocks();
  }, []);

  const loadBlocks = async () => {
    console.log('[APP] 📚 LOAD BLOCKS - Function called');
    console.log('[APP] ⏳ Setting loading = true');

    try {
      setLoading(true);
      setError(null);

      console.log('[APP] 📡 Fetching blocks from API...');
      const fetchedBlocks = await api.fetchBlocks();

      console.log('[APP] ✅ Blocks fetched successfully');
      console.log('[APP] 📦 Fetched blocks:', fetchedBlocks);
      console.log('[APP] 📊 Number of blocks:', fetchedBlocks.length);

      setBlocks(fetchedBlocks);
      console.log('[APP] 💾 Blocks state updated');

      // If no blocks exist, create an empty one automatically
      if (fetchedBlocks.length === 0) {
        console.log('[APP] 🆕 No blocks found, creating initial empty block');

        const emptyBlock = {
          id: `block-${Date.now()}`,
          type: 'text' as const,
          textType: 'paragraph' as const,
          value: '',
        };

        console.log('[APP] 📝 Empty block created:', emptyBlock);

        try {
          console.log('[APP] 📤 Sending empty block to API...');
          await api.createBlock(emptyBlock);

          console.log('[APP] ✅ Empty block created successfully');
          setBlocks([emptyBlock]);
          console.log('[APP] 💾 Blocks state updated with empty block');
        } catch (createErr) {
          console.error('[APP] ❌ Error creating initial block:', createErr);
        }
      }
    } catch (err) {
      console.error('[APP] ❌ LOAD BLOCKS FAILED');
      console.error('[APP] 📄 Error details:', err);

      setError('Failed to load blocks');
      console.log('[APP] 💥 Error state set');
    } finally {
      console.log('[APP] ⏳ Setting loading = false');
      setLoading(false);
    }

    console.log('[APP] ✅ LOAD BLOCKS - Function complete');
  };

  const handleAddBlockInline = async () => {
    // Create a new empty text block immediately (no modal)
    const newBlock = {
      id: `block-${Date.now()}`,
      type: 'text' as const,
      textType: 'paragraph' as const,
      value: '',
    };

    try {
      await api.createBlock(newBlock);
      await loadBlocks();
    } catch (err) {
      console.error('Error creating block:', err);
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

  const handleUpdateBlock = async (id: string, updates: Partial<Block>) => {
    try {
      const blockToUpdate = blocks.find(b => b.id === id);
      if (!blockToUpdate) return;

      const updatedBlock = { ...blockToUpdate, ...updates } as Block;
      await api.updateBlock(id, updatedBlock);
      await loadBlocks();
    } catch (err) {
      alert('Failed to update block');
      console.error('Error updating block:', err);
    }
  };

  const handleConvertBlock = async (block: Block, newType: 'text' | 'image', textType?: string) => {
    try {
      if (newType === 'text' && textType) {
        const updatedBlock = {
          id: block.id,
          type: 'text' as const,
          textType: textType as any,
          value: block.type === 'text' ? block.value : '',
        };
        await api.updateBlock(block.id, updatedBlock as Block);
        await loadBlocks();
      }
    } catch (err) {
      alert('Failed to convert block');
      console.error('Error converting block:', err);
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
          <div className="page-title">{pageTitle}</div>
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
            <div
              className="page-icon"
              onClick={() => setShowEmojiPicker(!showEmojiPicker)}
              title="Change icon"
            >
              {pageIcon}
            </div>
            {showEmojiPicker && (
              <div className="emoji-picker">
                {['📄', '📝', '📌', '📍', '📎', '📋', '📊', '📈', '📉', '🗂️', '📁', '📂', '🗃️', '📚', '📖', '📕', '📗', '📘', '📙', '📓', '📔', '📒', '📰', '🗞️', '💡', '🔥', '✨', '🎯', '🎨', '🎭', '🎪', '🎬', '🎮', '🎯', '⚡', '🌟', '🚀', '🎉', '🎊', '🎁', '🏆', '🥇', '🥈', '🥉', '💎', '👑', '🎓'].map(emoji => (
                  <button
                    key={emoji}
                    className="emoji-option"
                    onClick={() => {
                      setPageIcon(emoji);
                      setShowEmojiPicker(false);
                    }}
                  >
                    {emoji}
                  </button>
                ))}
              </div>
            )}
            <h1
              className="page-title-large"
              contentEditable
              suppressContentEditableWarning
              onInput={(e) => setPageTitle(e.currentTarget.textContent || 'Untitled')}
              onBlur={(e) => setPageTitle(e.currentTarget.textContent || 'Untitled')}
              onKeyDown={(e) => {
                if (e.key === 'Enter') {
                  e.preventDefault();
                  e.currentTarget.blur();
                }
              }}
            >
              {pageTitle}
            </h1>
          </div>

          {/* Blocks */}
          <div
            className="blocks-list"
            onClick={(e) => {
              // If clicking on the empty space (not on a block), create a new block
              if (e.target === e.currentTarget) {
                handleAddBlockInline();
              }
            }}
          >
            {blocks.map((block) => (
              <BlockRenderer
                key={block.id}
                block={block}
                onDelete={handleDeleteBlock}
                onUpdate={handleUpdateBlock}
                onConvert={handleConvertBlock}
              />
            ))}

            {/* Clickable empty area to add blocks */}
            <div
              className="empty-click-area"
              onClick={handleAddBlockInline}
            >
              {blocks.length === 0 && (
                <div className="empty-state-text">Click anywhere to start typing...</div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default App;

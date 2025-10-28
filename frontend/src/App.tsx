import { useState, useEffect } from 'react';
import type { Block } from './types';
import { BlockRenderer } from './components/BlockRenderer';
import { HelpModal } from './components/HelpModal';
import * as api from './api';
import './App.css';


function App() {

  const [blocks, setBlocks] = useState<Block[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [pageTitle, setPageTitle] = useState('Untitled');
  const [pageIcon, setPageIcon] = useState('📄');
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  const [coverImage, setCoverImage] = useState<string | null>(null);
  const [showCoverInput, setShowCoverInput] = useState(false);

  const handleCoverImageUpload = async (file: File) => {
    console.log('[APP] 🖼️ COVER IMAGE UPLOAD - Starting');
    console.log('[APP] 📁 File:', file.name, file.type, file.size);

    try {
      // Convert to base64
      const reader = new FileReader();
      reader.onload = (e) => {
        const base64 = e.target?.result as string;
        console.log('[APP] ✅ Image converted to base64');
        console.log('[APP] 📏 Base64 length:', base64.length);
        setCoverImage(base64);
        console.log('[APP] 💾 Cover image state updated');
      };
      reader.onerror = (error) => {
        console.error('[APP] ❌ Error reading file:', error);
      };
      reader.readAsDataURL(file);
    } catch (err) {
      console.error('[APP] ❌ Cover upload failed:', err);
    }
  };

  const handleCoverUrlSubmit = (url: string) => {
    console.log('[APP] 🖼️ COVER URL SUBMIT - Starting');
    console.log('[APP] 🔗 URL:', url);

    if (url) {
      console.log('[APP] ✅ URL is valid, setting cover image');
      setCoverImage(url);
      setShowCoverInput(false);
      console.log('[APP] 💾 Cover image state updated');
    } else {
      console.log('[APP] ⚠️ URL is empty, not setting cover');
    }
  };
  const [showHelp, setShowHelp] = useState(false);

  useEffect(() => {
    loadBlocks();
  }, []);

  const loadBlocks = async () => {

    try {
      setLoading(true);
      setError(null);

      const fetchedBlocks = await api.fetchBlocks();


      setBlocks(fetchedBlocks);

      // If no blocks exist, create an empty one automatically
      if (fetchedBlocks.length === 0) {

        const emptyBlock = {
          id: `block-${Date.now()}`,
          type: 'text' as const,
          textType: 'paragraph' as const,
          value: '',
        };


        try {
          await api.createBlock(emptyBlock);

          setBlocks([emptyBlock]);
        } catch (createErr) {
          console.error('[APP] ❌ Error creating initial block:', createErr);
        }
      }
    } catch (err) {
      console.error('[APP] ❌ LOAD BLOCKS FAILED');
      console.error('[APP] 📄 Error details:', err);

      setError('Failed to load blocks');
    } finally {
      setLoading(false);
    }

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

      // Optimistically update UI first
      setBlocks(prevBlocks =>
        prevBlocks.map(b => b.id === id ? updatedBlock : b)
      );

      // Then save to backend
      await api.updateBlock(id, updatedBlock);
    } catch (err) {
      alert('Failed to update block');
      console.error('Error updating block:', err);
      // Reload on error to get correct state
      await loadBlocks();
    }
  };

  const handleConvertBlock = async (block: Block, newType: 'text' | 'image', textType?: string) => {
    try {
      if (newType === 'text' && textType) {
        const updatedBlock = {
          id: block.id,
          type: 'text' as const,
          textType: textType as 'h1' | 'h2' | 'h3' | 'paragraph',
          value: block.type === 'text' ? block.value : '',
        };

        // Optimistically update UI
        setBlocks(prevBlocks =>
          prevBlocks.map(b => b.id === block.id ? updatedBlock : b)
        );

        // Then save to backend
        await api.updateBlock(block.id, updatedBlock);
      }
    } catch (err) {
      alert('Failed to convert block');
      console.error('Error converting block:', err);
      // Reload on error
      await loadBlocks();
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
      {/* Help button */}
      <button
        className="help-button"
        onClick={() => setShowHelp(true)}
        title="Help & Features"
      >
        ?
      </button>

      {/* Help modal */}
      <HelpModal isOpen={showHelp} onClose={() => setShowHelp(false)} />

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

          {/* Cover image */}
          {coverImage && (
            <div className="cover-image-container">
              <img src={coverImage} alt="Cover" className="cover-image" />
              <button
                className="remove-cover-btn"
                onClick={() => setCoverImage(null)}
                title="Remove cover"
              >
                × Remove cover
              </button>
            </div>
          )}

          {/* Add cover button */}
          {!coverImage && (
            <div className="add-cover-container">
              {!showCoverInput ? (
                <button
                  className="add-cover-btn"
                  onClick={() => setShowCoverInput(true)}
                >
                  🖼️ Add cover
                </button>
              ) : (
                <div className="cover-input-container">
                  <input
                    type="url"
                    className="cover-url-input"
                    placeholder="Paste image URL..."
                    autoFocus
                    onKeyDown={(e) => {
                      if (e.key === 'Enter') {
                        const url = e.currentTarget.value.trim();
                        if (url) {
                          setCoverImage(url);
                          setShowCoverInput(false);
                          e.currentTarget.value = '';
                        }
                      } else if (e.key === 'Escape') {
                        setShowCoverInput(false);
                        e.currentTarget.value = '';
                      }
                    }}
                    onBlur={() => setShowCoverInput(false)}
                  />
                  <div className="cover-input-hint">
                    Press Enter to add • Escape to cancel
                  </div>
                </div>
              )}
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
                {[
                  '📄', '📝', '📌', '📍', '📎', '📋', '📊', '📈', '📉', '🗂️',
                  '📁', '📂', '🗃️', '📚', '📖', '📕', '📗', '📘', '📙', '📓',
                  '📔', '📒', '📰', '🗞️', '💡', '🔥', '✨', '🎯', '🎨', '🎭',
                  '🎪', '🎬', '🎮', '⚡', '🌟', '🚀', '🎉', '🎊', '🎁', '🏆',
                  '🥇', '🥈', '🥉', '💎', '👑', '🎓', '💼', '🔬', '🔭', '🎪',
                  '🎨', '🖼️', '🎭', '🎪', '🎬', '📷', '📹', '🎥', '📺', '📻',
                  '🎙️', '🎚️', '🎛️', '⏱️', '⏰', '⏲️', '🕰️', '⌚', '📱', '💻',
                  '⌨️', '🖥️', '🖨️', '🖱️', '🖲️', '🕹️', '💾', '💿', '📀', '🧮',
                  '🎓', '📚', '📖', '📝', '✏️', '✒️', '🖊️', '🖋️', '📏', '📐',
                  '🌍', '🌎', '🌏', '🗺️', '🧭', '⛰️', '🏔️', '🗻', '🏕️', '🏖️',
                  '🏝️', '🏜️', '🏞️', '🏟️', '🏛️', '🏗️', '🏘️', '🏚️', '🏠', '🏡',
                  '🍎', '🍊', '🍋', '🍌', '🍉', '🍇', '🍓', '🍈', '🍒', '🍑',
                  '🥭', '🍍', '🥥', '🥝', '🍅', '🥑', '🥦', '🥬', '🥒', '🌶️',
                  '🌽', '🥕', '🧄', '🧅', '🥔', '🍠', '🥐', '🥯', '🍞', '🥖',
                  '🐶', '🐱', '🐭', '🐹', '🐰', '🦊', '🐻', '🐼', '🐨', '🐯',
                  '🦁', '🐮', '🐷', '🐸', '🐵', '🐔', '🐧', '🐦', '🐤', '🦆',
                  '🦅', '🦉', '🦇', '🐺', '🐗', '🐴', '🦄', '🐝', '🐛', '🦋',
                  '🐌', '🐞', '🐜', '🦟', '🦗', '🕷️', '🦂', '🐢', '🐍', '🦎',
                  '🦖', '🦕', '🐙', '🦑', '🦐', '🦞', '🦀', '🐡', '🐠', '🐟',
                  '🐬', '🐳', '🐋', '🦈', '🐊', '🐅', '🐆', '🦓', '🦍', '🦧'
                ].map(emoji => (
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

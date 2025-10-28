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
  const [showHelp, setShowHelp] = useState(false);
  const [isFilePickerOpen, setIsFilePickerOpen] = useState(false);

  const handleCoverImageUpload = async (file: File) => {
    console.log('[APP] 📁 File selected:', file.name, file.type, file.size);
    // For now, we'll use a simple file-to-data-URL approach
    // In production, you'd upload to S3 and get back a URL
    const reader = new FileReader();
    reader.onloadend = async () => {
      console.log('[APP] ✅ File converted to data URL');
      console.log('[APP] 💾 Setting cover image');
      const imageUrl = reader.result as string;
      setCoverImage(imageUrl);
      setShowCoverInput(false);
      console.log('[APP] ✅ Cover image set!');

      // Persist to backend
      try {
        await api.updatePageMetadata({ coverImage: imageUrl });
        console.log('[APP] ✅ Cover image persisted to backend');
      } catch (err) {
        console.error('[APP] ❌ Error persisting cover image:', err);
      }
    };
    reader.onerror = () => {
      console.error('[APP] ❌ Error reading file');
    };
    reader.readAsDataURL(file);
  };

  const handleCoverUrlSubmit = async (url: string) => {
    console.log('[APP] 🔗 URL submitted:', url);
    if (url) {
      console.log('[APP] ✅ Valid URL, setting cover image');
      setCoverImage(url);
      setShowCoverInput(false);
      console.log('[APP] ✅ Cover image set!');

      // Persist to backend
      try {
        await api.updatePageMetadata({ coverImage: url });
        console.log('[APP] ✅ Cover image URL persisted to backend');
      } catch (err) {
        console.error('[APP] ❌ Error persisting cover image URL:', err);
      }
    } else {
      console.log('[APP] ⚠️ Empty URL, not setting cover');
    }
  };

  useEffect(() => {
    loadBlocks();
    loadPageMetadata();
  }, []);

  const loadPageMetadata = async () => {
    try {
      const metadata = await api.fetchPageMetadata();
      setPageTitle(metadata.title);
      setPageIcon(metadata.icon);
      setCoverImage(metadata.coverImage);
    } catch (err) {
      console.error('[APP] ❌ Error loading page metadata:', err);
      // Use default values on error
    }
  };

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
                onClick={async () => {
                  setCoverImage(null);
                  // Persist to backend
                  try {
                    await api.updatePageMetadata({ coverImage: null });
                    console.log('[APP] ✅ Cover removed and persisted');
                  } catch (err) {
                    console.error('[APP] ❌ Error persisting cover removal:', err);
                  }
                }}
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
                  onClick={() => {
                    console.log('[APP] 🖼️ Add cover button clicked');
                    setShowCoverInput(true);
                  }}
                >
                  🖼️ Add cover
                </button>
              ) : (
                <div className="cover-input-container">
                  <input
                    type="file"
                    accept="image/*"
                    id="cover-file-input"
                    style={{ display: 'none' }}
                    onChange={(e) => {
                      console.log('[APP] 📂 File input changed');
                      setIsFilePickerOpen(false);
                      const file = e.target.files?.[0];
                      if (file) {
                        console.log('[APP] 📁 File selected from input:', file.name);
                        handleCoverImageUpload(file);
                        setShowCoverInput(false);
                      } else {
                        console.log('[APP] ❌ No file selected (user cancelled)');
                      }
                    }}
                    onFocus={() => {
                      console.log('[APP] 📂 File input focused - file picker likely closed');
                      setIsFilePickerOpen(false);
                    }}
                  />
                  <label
                    htmlFor="cover-file-input"
                    className="cover-upload-btn"
                    onMouseDown={(e) => {
                      console.log('[APP] 🖱️ Upload button mousedown - preventing blur');
                      // Prevent the URL input from blurring and closing the container
                      e.preventDefault();
                    }}
                    onClick={() => {
                      console.log('[APP] 🖱️ Upload Image button clicked - file picker opening');
                      setIsFilePickerOpen(true);
                    }}
                  >
                    📁 Upload Image
                  </label>
                  <span className="cover-input-divider">or</span>
                  <input
                    type="url"
                    className="cover-url-input"
                    placeholder="Paste image URL..."
                    autoFocus
                    onKeyDown={(e) => {
                      console.log('[APP] ⌨️ Key pressed in URL input:', e.key);
                      if (e.key === 'Enter') {
                        const url = e.currentTarget.value.trim();
                        console.log('[APP] ↩️ Enter pressed with URL:', url);
                        handleCoverUrlSubmit(url);
                        e.currentTarget.value = '';
                      } else if (e.key === 'Escape') {
                        console.log('[APP] ⎋ Escape pressed, closing input');
                        setShowCoverInput(false);
                        e.currentTarget.value = '';
                      }
                    }}
                    onBlur={(e) => {
                      console.log('[APP] 👋 Cover input blurred');
                      console.log('[APP] 🎯 Related target:', e.relatedTarget);
                      console.log('[APP] 📁 File picker open?', isFilePickerOpen);

                      // Don't close if file picker is open
                      if (isFilePickerOpen) {
                        console.log('[APP] ⏸️ File picker is open, keeping cover input visible');
                        return;
                      }

                      // Close after a short delay for other blur events
                      console.log('[APP] 🕐 Setting 200ms timeout to close input');
                      setTimeout(() => {
                        if (!isFilePickerOpen) {
                          console.log('[APP] ❌ Closing cover input after timeout');
                          setShowCoverInput(false);
                        } else {
                          console.log('[APP] ⏸️ File picker opened during timeout, not closing');
                        }
                      }, 200);
                    }}
                  />
                  <div className="cover-input-hint">
                    Upload a file or paste URL • Press Enter • Esc to cancel
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Page icon and title */}
          <div className="page-header">
            <div
              className="page-icon"
              onClick={(e) => {
                console.log('[APP] 🎨 Page icon clicked');
                e.stopPropagation();
                setShowEmojiPicker(!showEmojiPicker);
                console.log('[APP] 📌 Emoji picker toggled:', !showEmojiPicker);
              }}
              title="Change icon"
            >
              {pageIcon}
            </div>
            {showEmojiPicker && (
              <>
                <div
                  className="emoji-picker-backdrop"
                  onClick={() => {
                    console.log('[APP] 🖱️ Backdrop clicked, closing emoji picker');
                    setShowEmojiPicker(false);
                  }}
                />
                <div className="emoji-picker" onClick={(e) => {
                  console.log('[APP] 🎯 Emoji picker clicked (stopping propagation)');
                  e.stopPropagation();
                }}>
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
                      onClick={async (e) => {
                        console.log('[APP] 😀 Emoji clicked:', emoji);
                        e.preventDefault();
                        e.stopPropagation();
                        console.log('[APP] 💾 Setting page icon to:', emoji);
                        setPageIcon(emoji);
                        console.log('[APP] ❌ Closing emoji picker');
                        setShowEmojiPicker(false);
                        console.log('[APP] ✅ Emoji picker closed, icon set to:', emoji);

                        // Persist to backend
                        try {
                          await api.updatePageMetadata({ icon: emoji });
                          console.log('[APP] ✅ Page icon persisted:', emoji);
                        } catch (err) {
                          console.error('[APP] ❌ Error persisting page icon:', err);
                        }
                      }}
                      onMouseDown={(e) => {
                        console.log('[APP] 🖱️ Emoji mousedown:', emoji);
                        e.preventDefault();
                      }}
                    >
                      {emoji}
                    </button>
                  ))}
                </div>
              </>
            )}
            <h1
              className="page-title-large"
              contentEditable
              suppressContentEditableWarning
              onBlur={async (e) => {
                const newTitle = e.currentTarget.textContent || 'Untitled';
                setPageTitle(newTitle);

                // Persist to backend
                try {
                  await api.updatePageMetadata({ title: newTitle });
                  console.log('[APP] ✅ Page title persisted:', newTitle);
                } catch (err) {
                  console.error('[APP] ❌ Error persisting page title:', err);
                }
              }}
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

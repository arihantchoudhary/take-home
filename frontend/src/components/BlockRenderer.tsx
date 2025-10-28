import React, { useState, useRef, useEffect } from 'react';
import type { Block, TextBlock, ImageBlock } from '../types';
import { SlashCommandMenu } from './SlashCommandMenu';
import { BlockEditor } from './BlockEditor';

console.log('[BLOCK_RENDERER] 🚀 BlockRenderer Module Loaded');

interface BlockRendererProps {
  block: Block;
  onDelete: (id: string) => void | Promise<void>;
  onUpdate: (id: string, updates: Partial<Block>) => void | Promise<void>;
  onConvert?: (block: Block, newType: 'text' | 'image', textType?: string) => void | Promise<void>;
}

export const BlockRenderer: React.FC<BlockRendererProps> = ({ block, onDelete, onUpdate, onConvert }) => {
  console.log('[BLOCK_RENDERER] 🔄 Rendering block:', block.id);
  console.log('[BLOCK_RENDERER] 📦 Block type:', block.type);
  console.log('[BLOCK_RENDERER] 📝 Block data:', block);

  const [showSlashMenu, setShowSlashMenu] = useState(false);
  const [slashMenuPosition, setSlashMenuPosition] = useState({ top: 0, left: 0 });
  const [slashFilter, setSlashFilter] = useState('');
  const [showEditor, setShowEditor] = useState(false);
  const textRef = useRef<HTMLElement>(null);

  // Auto-focus empty blocks
  useEffect(() => {
    console.log('[BLOCK_RENDERER] 🎬 useEffect - Auto-focus check for block:', block.id);
    if (block.type === 'text' && !block.value && textRef.current) {
      console.log('[BLOCK_RENDERER] 🎯 Auto-focusing empty text block:', block.id);
      textRef.current.focus();
    }
  }, []);

  if (block.type === 'text') {
    const textBlock = block as TextBlock;

    const getClassName = () => {
      switch (textBlock.textType) {
        case 'h1': return 'block-h1';
        case 'h2': return 'block-h2';
        case 'h3': return 'block-h3';
        case 'paragraph': return 'block-paragraph';
        default: return 'block-paragraph';
      }
    };

    const Tag = textBlock.textType === 'h1' ? 'h1' :
                textBlock.textType === 'h2' ? 'h2' :
                textBlock.textType === 'h3' ? 'h3' : 'p';

    const handleInput = (e: React.FormEvent<HTMLElement>) => {
      const text = e.currentTarget.textContent || '';
      console.log('[BLOCK_RENDERER] ⌨️  User typing in block:', block.id);
      console.log('[BLOCK_RENDERER] 📝 Current text:', text);

      // Check if user typed '/'
      if (text.endsWith('/')) {
        console.log('[BLOCK_RENDERER] ⚡ Slash command detected!');
        const selection = window.getSelection();
        if (selection && selection.rangeCount > 0) {
          const range = selection.getRangeAt(0);
          const rangeRect = range.getBoundingClientRect();

          const menuPosition = {
            top: rangeRect.bottom + window.scrollY + 4,
            left: rangeRect.left + window.scrollX,
          };
          console.log('[BLOCK_RENDERER] 📍 Opening slash menu at position:', menuPosition);

          setSlashMenuPosition(menuPosition);
          setShowSlashMenu(true);
          setSlashFilter('');
          console.log('[BLOCK_RENDERER] ✅ Slash menu opened');
        }
      } else if (showSlashMenu) {
        // Extract filter text after the slash
        const slashIndex = text.lastIndexOf('/');
        if (slashIndex !== -1) {
          const filter = text.substring(slashIndex + 1);
          console.log('[BLOCK_RENDERER] 🔍 Filtering slash menu with:', filter);
          setSlashFilter(filter);
        } else {
          console.log('[BLOCK_RENDERER] ❌ Closing slash menu - no slash found');
          setShowSlashMenu(false);
        }
      }
    };

    const handleSlashMenuSelect = (item: any) => {
      console.log('[BLOCK_RENDERER] 🎯 Slash menu item selected:', item);
      console.log('[BLOCK_RENDERER] 🔄 Converting block to type:', item.textType);

      // Remove the slash and any filter text
      if (textRef.current) {
        const text = textRef.current.textContent || '';
        const slashIndex = text.lastIndexOf('/');
        if (slashIndex !== -1) {
          const newText = text.substring(0, slashIndex);
          textRef.current.textContent = newText;
          console.log('[BLOCK_RENDERER] ✂️  Removed slash command from text. New text:', newText);
        }
      }

      console.log('[BLOCK_RENDERER] ❌ Closing slash menu');
      setShowSlashMenu(false);

      if (onConvert && item.textType) {
        console.log('[BLOCK_RENDERER] 📤 Calling onConvert with:', { blockId: block.id, textType: item.textType });
        onConvert(block, 'text', item.textType);
      }
    };

    return (
      <>
        <div
          className="block-wrapper"
        >
          <div className="block-actions">
            <button className="block-drag-handle" title="Drag">⋮⋮</button>
            <button
              className="block-delete-btn"
              onClick={(e) => {
                console.log('[BLOCK_RENDERER] 🗑️  Delete button clicked for block:', block.id);
                e.stopPropagation();
                console.log('[BLOCK_RENDERER] 📤 Calling onDelete');
                onDelete(block.id);
              }}
              title="Delete"
            >
              ×
            </button>
          </div>
          <Tag
            ref={textRef as any}
            className={getClassName()}
            contentEditable
            suppressContentEditableWarning
            onInput={handleInput}
            onBlur={(e) => {
              console.log('[BLOCK_RENDERER] 👁️  Block lost focus:', block.id);
              // Save changes when user clicks away or tabs out
              const newValue = e.currentTarget.textContent || '';
              console.log('[BLOCK_RENDERER] 💾 Checking if value changed. Old:', textBlock.value, 'New:', newValue);
              if (newValue !== textBlock.value) {
                console.log('[BLOCK_RENDERER] ✅ Value changed! Calling onUpdate');
                console.log('[BLOCK_RENDERER] 📤 Updating block:', block.id, 'with value:', newValue);
                onUpdate(block.id, { value: newValue } as Partial<Block>);
              } else {
                console.log('[BLOCK_RENDERER] ⏭️  No change detected, skipping update');
              }
            }}
            onKeyDown={(e) => {
              console.log('[BLOCK_RENDERER] ⌨️  Key pressed:', e.key, 'in block:', block.id);
              if (e.key === 'Enter' && !e.shiftKey) {
                console.log('[BLOCK_RENDERER] ↩️  Enter key pressed (without Shift)');
                e.preventDefault();
                // Save current value before creating new block
                const newValue = e.currentTarget.textContent || '';
                console.log('[BLOCK_RENDERER] 💾 Saving value before new block. Old:', textBlock.value, 'New:', newValue);
                if (newValue !== textBlock.value) {
                  console.log('[BLOCK_RENDERER] 📤 Calling onUpdate before creating new block');
                  onUpdate(block.id, { value: newValue } as Partial<Block>);
                }
                console.log('[BLOCK_RENDERER] 📝 TODO: Create new block below');
                // TODO: Create new block below
              } else if (e.key === 'Escape' && showSlashMenu) {
                console.log('[BLOCK_RENDERER] ❌ Escape pressed - closing slash menu');
                e.preventDefault();
                setShowSlashMenu(false);
              }
            }}
          >
            {textBlock.value || ''}
          </Tag>
        </div>
        {showSlashMenu && (
          <SlashCommandMenu
            position={slashMenuPosition}
            filter={slashFilter}
            onSelect={handleSlashMenuSelect}
            onClose={() => setShowSlashMenu(false)}
          />
        )}
      </>
    );
  }

  if (block.type === 'image') {
    console.log('[BLOCK_RENDERER] 🖼️  Rendering image block:', block.id);
    const imageBlock = block as ImageBlock;
    console.log('[BLOCK_RENDERER] 📷 Image src:', imageBlock.src);
    console.log('[BLOCK_RENDERER] 📐 Image dimensions:', imageBlock.width, 'x', imageBlock.height);

    const handleSaveEdit = (updatedBlock: Block) => {
      console.log('[BLOCK_RENDERER] 💾 Saving image block edits');
      console.log('[BLOCK_RENDERER] 📤 Updated block data:', updatedBlock);
      onUpdate(block.id, updatedBlock);
      console.log('[BLOCK_RENDERER] ❌ Closing image editor');
      setShowEditor(false);
    };

    return (
      <>
        <div className="block-wrapper">
          <div className="block-actions">
            <button className="block-drag-handle" title="Drag">⋮⋮</button>
            <button
              className="block-edit-btn"
              onClick={(e) => {
                console.log('[BLOCK_RENDERER] ✏️  Edit button clicked for image block:', block.id);
                e.stopPropagation();
                console.log('[BLOCK_RENDERER] ✅ Opening image editor');
                setShowEditor(true);
              }}
              title="Edit"
            >
              ✎
            </button>
            <button
              className="block-delete-btn"
              onClick={(e) => {
                console.log('[BLOCK_RENDERER] 🗑️  Delete button clicked for image block:', block.id);
                e.stopPropagation();
                console.log('[BLOCK_RENDERER] 📤 Calling onDelete');
                onDelete(block.id);
              }}
              title="Delete"
            >
              ×
            </button>
          </div>
          <div className="block-image-container">
            <img
              src={imageBlock.src}
              alt="Block"
              className="block-image"
              style={{
                width: `${imageBlock.width}px`,
                height: `${imageBlock.height}px`,
                objectFit: 'cover'
              }}
            />
          </div>
        </div>
        {showEditor && (
          <BlockEditor
            block={block}
            onSave={handleSaveEdit}
            onCancel={() => setShowEditor(false)}
          />
        )}
      </>
    );
  }

  return null;
};

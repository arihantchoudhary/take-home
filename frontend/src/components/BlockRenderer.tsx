import React, { useState, useRef, useEffect } from 'react';
import type { Block, TextBlock, ImageBlock } from '../types';
import { SlashCommandMenu } from './SlashCommandMenu';
import { BlockEditor } from './BlockEditor';


interface BlockRendererProps {
  block: Block;
  onDelete: (id: string) => void | Promise<void>;
  onUpdate: (id: string, updates: Partial<Block>) => void | Promise<void>;
  onConvert?: (block: Block, newType: 'text' | 'image', textType?: string) => void | Promise<void>;
}

export const BlockRenderer: React.FC<BlockRendererProps> = ({ block, onDelete, onUpdate, onConvert }) => {

  const [showSlashMenu, setShowSlashMenu] = useState(false);
  const [slashMenuPosition, setSlashMenuPosition] = useState({ top: 0, left: 0 });
  const [slashFilter, setSlashFilter] = useState('');
  const [showEditor, setShowEditor] = useState(false);
  const textRef = useRef<HTMLElement>(null);

  // Auto-focus empty blocks
  useEffect(() => {
    if (block.type === 'text' && !block.value && textRef.current) {
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

      // Check if user typed '/'
      if (text.endsWith('/')) {
        const selection = window.getSelection();
        if (selection && selection.rangeCount > 0) {
          const range = selection.getRangeAt(0);
          const rangeRect = range.getBoundingClientRect();

          const menuPosition = {
            top: rangeRect.bottom + window.scrollY + 4,
            left: rangeRect.left + window.scrollX,
          };

          setSlashMenuPosition(menuPosition);
          setShowSlashMenu(true);
          setSlashFilter('');
        }
      } else if (showSlashMenu) {
        // Extract filter text after the slash
        const slashIndex = text.lastIndexOf('/');
        if (slashIndex !== -1) {
          const filter = text.substring(slashIndex + 1);
          setSlashFilter(filter);
        } else {
          setShowSlashMenu(false);
        }
      }
    };

    const handleSlashMenuSelect = (item: any) => {

      // Remove the slash and any filter text
      if (textRef.current) {
        const text = textRef.current.textContent || '';
        const slashIndex = text.lastIndexOf('/');
        if (slashIndex !== -1) {
          const newText = text.substring(0, slashIndex);
          textRef.current.textContent = newText;
        }
      }

      setShowSlashMenu(false);

      if (onConvert && item.textType) {
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
                e.stopPropagation();
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
              // Save changes when user clicks away or tabs out
              const newValue = e.currentTarget.textContent || '';
              if (newValue !== textBlock.value) {
                onUpdate(block.id, { value: newValue } as Partial<Block>);
              } else {
              }
            }}
            onKeyDown={(e) => {
              if (e.key === 'Enter' && !e.shiftKey) {
                e.preventDefault();
                // Save current value before creating new block
                const newValue = e.currentTarget.textContent || '';
                if (newValue !== textBlock.value) {
                  onUpdate(block.id, { value: newValue } as Partial<Block>);
                }
                // TODO: Create new block below
              } else if (e.key === 'Escape' && showSlashMenu) {
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
    const imageBlock = block as ImageBlock;

    const handleSaveEdit = (updatedBlock: Block) => {
      onUpdate(block.id, updatedBlock);
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
                e.stopPropagation();
                setShowEditor(true);
              }}
              title="Edit"
            >
              ✎
            </button>
            <button
              className="block-delete-btn"
              onClick={(e) => {
                e.stopPropagation();
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

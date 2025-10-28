import React, { useState } from 'react';
import type { Block, TextBlock, ImageBlock } from '../types';

interface BlockRendererProps {
  block: Block;
  onEdit: (block: Block) => void;
  onDelete: (id: string) => void;
}

export const BlockRenderer: React.FC<BlockRendererProps> = ({ block, onEdit, onDelete }) => {
  const [isHovered, setIsHovered] = useState(false);

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

    return (
      <div
        className="block-wrapper"
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
      >
        {isHovered && (
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
        )}
        <Tag
          className={getClassName()}
          contentEditable
          suppressContentEditableWarning
          onKeyDown={(e) => {
            if (e.key === 'Enter' && !e.shiftKey) {
              e.preventDefault();
              // TODO: Create new block below
            }
          }}
        >
          {textBlock.value || ''}
        </Tag>
      </div>
    );
  }

  if (block.type === 'image') {
    const imageBlock = block as ImageBlock;
    return (
      <div
        className="block-wrapper"
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
      >
        {isHovered && (
          <div className="block-actions">
            <button className="block-drag-handle" title="Drag">⋮⋮</button>
            <button
              className="block-edit-btn"
              onClick={(e) => {
                e.stopPropagation();
                onEdit(block);
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
        )}
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
    );
  }

  return null;
};

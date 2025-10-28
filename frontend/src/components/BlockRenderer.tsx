import React, { useState } from 'react';
import { GripVertical, Trash2 } from 'lucide-react';
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

    const getTextClassName = () => {
      const base = "w-full text-left cursor-pointer px-1 py-1 rounded-sm transition-colors outline-none";
      switch (textBlock.textType) {
        case 'h1':
          return `${base} text-4xl font-bold text-foreground`;
        case 'h2':
          return `${base} text-2xl font-bold text-foreground`;
        case 'h3':
          return `${base} text-xl font-bold text-foreground`;
        case 'paragraph':
          return `${base} text-base text-foreground leading-relaxed`;
        default:
          return `${base} text-base text-foreground`;
      }
    };

    const Tag = textBlock.textType === 'h1' ? 'h1' :
                textBlock.textType === 'h2' ? 'h2' :
                textBlock.textType === 'h3' ? 'h3' : 'p';

    return (
      <div
        className="notion-block group relative"
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
      >
        <div className="flex items-start gap-1">
          {/* Left toolbar - appears on hover */}
          <div className={`absolute -left-8 top-1 flex items-center gap-0.5 transition-opacity ${isHovered ? 'opacity-100' : 'opacity-0'}`}>
            <button
              className="p-1 hover:bg-muted rounded text-muted-foreground hover:text-foreground transition-colors"
              aria-label="Drag handle"
            >
              <GripVertical className="h-4 w-4" />
            </button>
          </div>

          {/* Content */}
          <Tag
            className={getTextClassName()}
            onClick={() => onEdit(block)}
          >
            {textBlock.value || (
              <span className="text-muted-foreground/50">
                {textBlock.textType === 'h1' && 'Heading 1'}
                {textBlock.textType === 'h2' && 'Heading 2'}
                {textBlock.textType === 'h3' && 'Heading 3'}
                {textBlock.textType === 'paragraph' && 'Empty'}
              </span>
            )}
          </Tag>

          {/* Delete button - appears on hover */}
          {isHovered && (
            <button
              onClick={(e) => {
                e.stopPropagation();
                onDelete(block.id);
              }}
              className="absolute right-2 top-1 p-1 hover:bg-destructive/10 rounded text-muted-foreground hover:text-destructive transition-colors"
              aria-label="Delete block"
            >
              <Trash2 className="h-4 w-4" />
            </button>
          )}
        </div>
      </div>
    );
  }

  if (block.type === 'image') {
    const imageBlock = block as ImageBlock;
    return (
      <div
        className="notion-block group relative"
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
      >
        <div className="flex items-start gap-1">
          {/* Left toolbar - appears on hover */}
          <div className={`absolute -left-8 top-1 flex items-center gap-0.5 transition-opacity ${isHovered ? 'opacity-100' : 'opacity-0'}`}>
            <button
              className="p-1 hover:bg-muted rounded text-muted-foreground hover:text-foreground transition-colors"
              aria-label="Drag handle"
            >
              <GripVertical className="h-4 w-4" />
            </button>
          </div>

          {/* Image */}
          <div className="w-full px-1">
            <img
              src={imageBlock.src}
              alt="Block image"
              className="max-w-full rounded-md cursor-pointer border border-border hover:border-border/80 transition-all"
              style={{
                width: `${imageBlock.width}px`,
                height: `${imageBlock.height}px`,
                objectFit: 'cover'
              }}
              onClick={() => onEdit(block)}
            />
          </div>

          {/* Delete button - appears on hover */}
          {isHovered && (
            <button
              onClick={(e) => {
                e.stopPropagation();
                onDelete(block.id);
              }}
              className="absolute right-2 top-1 p-1 hover:bg-destructive/10 rounded text-muted-foreground hover:text-destructive transition-colors"
              aria-label="Delete block"
            >
              <Trash2 className="h-4 w-4" />
            </button>
          )}
        </div>
      </div>
    );
  }

  return null;
};

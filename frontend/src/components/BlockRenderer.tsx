import React from 'react';
import type { Block, TextBlock, ImageBlock } from '../types';

interface BlockRendererProps {
  block: Block;
  onEdit: (block: Block) => void;
  onDelete: (id: string) => void;
}

export const BlockRenderer: React.FC<BlockRendererProps> = ({ block, onEdit, onDelete }) => {
  const handleClick = () => {
    onEdit(block);
  };

  if (block.type === 'text') {
    const textBlock = block as TextBlock;
    const style: React.CSSProperties = {
      cursor: 'pointer',
      padding: '8px',
      margin: '4px 0',
      borderRadius: '4px',
      transition: 'background-color 0.2s',
    };

    const textElement = (() => {
      switch (textBlock.textType) {
        case 'h1':
          return <h1 style={style} onClick={handleClick}>{textBlock.value || 'Empty H1'}</h1>;
        case 'h2':
          return <h2 style={style} onClick={handleClick}>{textBlock.value || 'Empty H2'}</h2>;
        case 'h3':
          return <h3 style={style} onClick={handleClick}>{textBlock.value || 'Empty H3'}</h3>;
        case 'paragraph':
          return <p style={style} onClick={handleClick}>{textBlock.value || 'Empty paragraph'}</p>;
        default:
          return <p style={style} onClick={handleClick}>{textBlock.value}</p>;
      }
    })();

    return (
      <div className="block-wrapper" style={{ position: 'relative', marginBottom: '8px' }}>
        {textElement}
        <button
          onClick={(e) => {
            e.stopPropagation();
            onDelete(block.id);
          }}
          style={{
            position: 'absolute',
            right: '8px',
            top: '8px',
            padding: '4px 8px',
            background: '#ff4444',
            color: 'white',
            border: 'none',
            borderRadius: '4px',
            cursor: 'pointer',
            fontSize: '12px',
          }}
        >
          Delete
        </button>
      </div>
    );
  }

  if (block.type === 'image') {
    const imageBlock = block as ImageBlock;
    return (
      <div className="block-wrapper" style={{ position: 'relative', marginBottom: '16px' }}>
        <img
          src={imageBlock.src}
          alt="Block image"
          style={{
            width: `${imageBlock.width}px`,
            height: `${imageBlock.height}px`,
            cursor: 'pointer',
            border: '1px solid #ddd',
            borderRadius: '4px',
          }}
          onClick={handleClick}
        />
        <button
          onClick={(e) => {
            e.stopPropagation();
            onDelete(block.id);
          }}
          style={{
            position: 'absolute',
            right: '8px',
            top: '8px',
            padding: '4px 8px',
            background: '#ff4444',
            color: 'white',
            border: 'none',
            borderRadius: '4px',
            cursor: 'pointer',
            fontSize: '12px',
          }}
        >
          Delete
        </button>
      </div>
    );
  }

  return null;
};

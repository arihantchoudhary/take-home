import React, { useState, useEffect } from 'react';
import { Block, TextBlock, ImageBlock, TextType } from '../types';

interface BlockEditorProps {
  block?: Block;
  onSave: (block: Block) => void;
  onCancel: () => void;
}

export const BlockEditor: React.FC<BlockEditorProps> = ({ block, onSave, onCancel }) => {
  const [blockType, setBlockType] = useState<'text' | 'image'>(block?.type || 'text');

  // Text block fields
  const [textType, setTextType] = useState<TextType>(
    block?.type === 'text' ? block.textType : 'paragraph'
  );
  const [textValue, setTextValue] = useState(
    block?.type === 'text' ? block.value : ''
  );

  // Image block fields
  const [imageSrc, setImageSrc] = useState(
    block?.type === 'image' ? block.src : ''
  );
  const [imageWidth, setImageWidth] = useState(
    block?.type === 'image' ? block.width : 400
  );
  const [imageHeight, setImageHeight] = useState(
    block?.type === 'image' ? block.height : 300
  );

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const id = block?.id || `block-${Date.now()}`;

    if (blockType === 'text') {
      const newBlock: TextBlock = {
        id,
        type: 'text',
        textType,
        value: textValue,
      };
      onSave(newBlock);
    } else {
      const newBlock: ImageBlock = {
        id,
        type: 'image',
        src: imageSrc,
        width: imageWidth,
        height: imageHeight,
      };
      onSave(newBlock);
    }
  };

  return (
    <div style={{
      position: 'fixed',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      backgroundColor: 'rgba(0, 0, 0, 0.5)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      zIndex: 1000,
    }}>
      <div style={{
        backgroundColor: 'white',
        padding: '24px',
        borderRadius: '8px',
        minWidth: '500px',
        maxWidth: '600px',
      }}>
        <h2>{block ? 'Edit Block' : 'Add New Block'}</h2>

        <form onSubmit={handleSubmit}>
          <div style={{ marginBottom: '16px' }}>
            <label style={{ display: 'block', marginBottom: '8px', fontWeight: 'bold' }}>
              Block Type:
            </label>
            <select
              value={blockType}
              onChange={(e) => setBlockType(e.target.value as 'text' | 'image')}
              disabled={!!block}
              style={{
                width: '100%',
                padding: '8px',
                fontSize: '14px',
                border: '1px solid #ddd',
                borderRadius: '4px',
              }}
            >
              <option value="text">Text</option>
              <option value="image">Image</option>
            </select>
          </div>

          {blockType === 'text' && (
            <>
              <div style={{ marginBottom: '16px' }}>
                <label style={{ display: 'block', marginBottom: '8px', fontWeight: 'bold' }}>
                  Text Type:
                </label>
                <select
                  value={textType}
                  onChange={(e) => setTextType(e.target.value as TextType)}
                  style={{
                    width: '100%',
                    padding: '8px',
                    fontSize: '14px',
                    border: '1px solid #ddd',
                    borderRadius: '4px',
                  }}
                >
                  <option value="h1">Heading 1</option>
                  <option value="h2">Heading 2</option>
                  <option value="h3">Heading 3</option>
                  <option value="paragraph">Paragraph</option>
                </select>
              </div>

              <div style={{ marginBottom: '16px' }}>
                <label style={{ display: 'block', marginBottom: '8px', fontWeight: 'bold' }}>
                  Text Value:
                </label>
                <textarea
                  value={textValue}
                  onChange={(e) => setTextValue(e.target.value)}
                  required
                  rows={4}
                  style={{
                    width: '100%',
                    padding: '8px',
                    fontSize: '14px',
                    border: '1px solid #ddd',
                    borderRadius: '4px',
                    resize: 'vertical',
                  }}
                  placeholder="Enter your text here..."
                />
              </div>
            </>
          )}

          {blockType === 'image' && (
            <>
              <div style={{ marginBottom: '16px' }}>
                <label style={{ display: 'block', marginBottom: '8px', fontWeight: 'bold' }}>
                  Image URL:
                </label>
                <input
                  type="url"
                  value={imageSrc}
                  onChange={(e) => setImageSrc(e.target.value)}
                  required
                  style={{
                    width: '100%',
                    padding: '8px',
                    fontSize: '14px',
                    border: '1px solid #ddd',
                    borderRadius: '4px',
                  }}
                  placeholder="https://example.com/image.jpg"
                />
              </div>

              <div style={{ marginBottom: '16px', display: 'flex', gap: '16px' }}>
                <div style={{ flex: 1 }}>
                  <label style={{ display: 'block', marginBottom: '8px', fontWeight: 'bold' }}>
                    Width (px):
                  </label>
                  <input
                    type="number"
                    value={imageWidth}
                    onChange={(e) => setImageWidth(Number(e.target.value))}
                    required
                    min="50"
                    max="1200"
                    style={{
                      width: '100%',
                      padding: '8px',
                      fontSize: '14px',
                      border: '1px solid #ddd',
                      borderRadius: '4px',
                    }}
                  />
                </div>

                <div style={{ flex: 1 }}>
                  <label style={{ display: 'block', marginBottom: '8px', fontWeight: 'bold' }}>
                    Height (px):
                  </label>
                  <input
                    type="number"
                    value={imageHeight}
                    onChange={(e) => setImageHeight(Number(e.target.value))}
                    required
                    min="50"
                    max="1200"
                    style={{
                      width: '100%',
                      padding: '8px',
                      fontSize: '14px',
                      border: '1px solid #ddd',
                      borderRadius: '4px',
                    }}
                  />
                </div>
              </div>
            </>
          )}

          <div style={{ display: 'flex', gap: '12px', justifyContent: 'flex-end', marginTop: '24px' }}>
            <button
              type="button"
              onClick={onCancel}
              style={{
                padding: '10px 20px',
                fontSize: '14px',
                border: '1px solid #ddd',
                borderRadius: '4px',
                backgroundColor: 'white',
                cursor: 'pointer',
              }}
            >
              Cancel
            </button>
            <button
              type="submit"
              style={{
                padding: '10px 20px',
                fontSize: '14px',
                border: 'none',
                borderRadius: '4px',
                backgroundColor: '#0066ff',
                color: 'white',
                cursor: 'pointer',
              }}
            >
              {block ? 'Update' : 'Create'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

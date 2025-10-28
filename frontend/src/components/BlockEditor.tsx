import React, { useState } from 'react';
import type { Block, TextBlock, ImageBlock, TextType } from '../types';

interface BlockEditorProps {
  block?: Block;
  onSave: (block: Block) => void;
  onCancel: () => void;
}

export const BlockEditor: React.FC<BlockEditorProps> = ({ block, onSave, onCancel }) => {
  const [blockType, setBlockType] = useState<'text' | 'image'>(block?.type || 'text');
  const [textType, setTextType] = useState<TextType>(
    block?.type === 'text' ? block.textType : 'paragraph'
  );
  const [textValue, setTextValue] = useState(
    block?.type === 'text' ? block.value : ''
  );
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
    <div className="modal-overlay" onClick={onCancel}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h2>{block ? 'Edit block' : 'Add new block'}</h2>
          <button className="modal-close" onClick={onCancel}>×</button>
        </div>

        <form onSubmit={handleSubmit} className="modal-form">
          <div className="form-group">
            <label>Block type</label>
            <select
              value={blockType}
              onChange={(e) => setBlockType(e.target.value as 'text' | 'image')}
              disabled={!!block}
              className="form-input"
            >
              <option value="text">Text</option>
              <option value="image">Image</option>
            </select>
          </div>

          {blockType === 'text' && (
            <>
              <div className="form-group">
                <label>Style</label>
                <select
                  value={textType}
                  onChange={(e) => setTextType(e.target.value as TextType)}
                  className="form-input"
                >
                  <option value="h1">Heading 1</option>
                  <option value="h2">Heading 2</option>
                  <option value="h3">Heading 3</option>
                  <option value="paragraph">Text</option>
                </select>
              </div>

              <div className="form-group">
                <label>Content</label>
                <textarea
                  value={textValue}
                  onChange={(e) => setTextValue(e.target.value)}
                  required
                  rows={5}
                  className="form-input form-textarea"
                  placeholder="Type something..."
                  autoFocus
                />
              </div>
            </>
          )}

          {blockType === 'image' && (
            <>
              <div className="form-group">
                <label>Image URL</label>
                <input
                  type="url"
                  value={imageSrc}
                  onChange={(e) => setImageSrc(e.target.value)}
                  required
                  className="form-input"
                  placeholder="https://example.com/image.jpg"
                  autoFocus
                />
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label>Width (px)</label>
                  <input
                    type="number"
                    value={imageWidth}
                    onChange={(e) => setImageWidth(Number(e.target.value))}
                    required
                    min="50"
                    max="1200"
                    className="form-input"
                  />
                </div>

                <div className="form-group">
                  <label>Height (px)</label>
                  <input
                    type="number"
                    value={imageHeight}
                    onChange={(e) => setImageHeight(Number(e.target.value))}
                    required
                    min="50"
                    max="1200"
                    className="form-input"
                  />
                </div>
              </div>
            </>
          )}

          <div className="form-actions">
            <button type="button" onClick={onCancel} className="btn btn-secondary">
              Cancel
            </button>
            <button type="submit" className="btn btn-primary">
              {block ? 'Save' : 'Create'}
            </button>
          </div>
        </form>
      </div>

      <style>{`
        .modal-overlay {
          position: fixed;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background: rgba(15, 15, 15, 0.6);
          backdrop-filter: blur(5px);
          display: flex;
          align-items: center;
          justify-content: center;
          z-index: 1000;
          animation: fadeIn 0.15s ease;
        }

        @keyframes fadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }

        .modal-content {
          background: white;
          border-radius: 8px;
          width: 90%;
          max-width: 520px;
          max-height: 90vh;
          overflow-y: auto;
          box-shadow: 0 8px 32px rgba(0, 0, 0, 0.12);
          animation: slideUp 0.2s ease;
        }

        @keyframes slideUp {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        .modal-header {
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding: 16px 20px;
          border-bottom: 1px solid rgba(55, 53, 47, 0.09);
        }

        .modal-header h2 {
          font-size: 16px;
          font-weight: 600;
          color: #37352f;
          margin: 0;
        }

        .modal-close {
          width: 28px;
          height: 28px;
          border-radius: 3px;
          border: none;
          background: none;
          color: rgba(55, 53, 47, 0.5);
          font-size: 24px;
          line-height: 1;
          cursor: pointer;
          display: flex;
          align-items: center;
          justify-content: center;
          transition: all 0.12s ease;
        }

        .modal-close:hover {
          background: rgba(55, 53, 47, 0.06);
        }

        .modal-form {
          padding: 20px;
        }

        .form-group {
          margin-bottom: 16px;
        }

        .form-group label {
          display: block;
          font-size: 13px;
          font-weight: 500;
          color: #37352f;
          margin-bottom: 6px;
        }

        .form-input {
          width: 100%;
          padding: 8px 10px;
          font-size: 14px;
          line-height: 1.5;
          color: #37352f;
          background: white;
          border: 1px solid rgba(55, 53, 47, 0.16);
          border-radius: 4px;
          outline: none;
          transition: all 0.12s ease;
          font-family: inherit;
        }

        .form-input:focus {
          border-color: rgba(35, 131, 226, 0.57);
          box-shadow: 0 0 0 1px rgba(35, 131, 226, 0.35);
        }

        .form-textarea {
          resize: vertical;
          min-height: 100px;
        }

        .form-row {
          display: flex;
          gap: 12px;
        }

        .form-row .form-group {
          flex: 1;
        }

        .form-actions {
          display: flex;
          gap: 8px;
          justify-content: flex-end;
          margin-top: 20px;
          padding-top: 16px;
          border-top: 1px solid rgba(55, 53, 47, 0.09);
        }

        .btn {
          padding: 0 12px;
          height: 32px;
          font-size: 14px;
          font-weight: 500;
          border-radius: 4px;
          border: none;
          cursor: pointer;
          transition: all 0.12s ease;
          font-family: inherit;
        }

        .btn-secondary {
          background: rgba(55, 53, 47, 0.06);
          color: rgba(55, 53, 47, 0.81);
        }

        .btn-secondary:hover {
          background: rgba(55, 53, 47, 0.12);
        }

        .btn-primary {
          background: #2383e2;
          color: white;
        }

        .btn-primary:hover {
          background: #1a6ec0;
        }
      `}</style>
    </div>
  );
};

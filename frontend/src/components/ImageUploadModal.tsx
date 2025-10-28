import React, { useState } from 'react';

interface ImageUploadModalProps {
  isOpen: boolean;
  onClose: () => void;
  onImageSelect: (imageUrl: string, width?: number, height?: number) => void;
}

export const ImageUploadModal: React.FC<ImageUploadModalProps> = ({ isOpen, onClose, onImageSelect }) => {
  const [imageUrl, setImageUrl] = useState('');
  const [isUploading, setIsUploading] = useState(false);

  if (!isOpen) return null;

  const handleFileSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setIsUploading(true);

    try {
      // Convert to base64
      const reader = new FileReader();
      reader.onload = (event) => {
        const result = event.target?.result as string;

        // Create an image to get dimensions
        const img = new Image();
        img.onload = () => {
          onImageSelect(result, img.width, img.height);
          setIsUploading(false);
          setImageUrl('');
          onClose();
        };
        img.src = result;
      };
      reader.readAsDataURL(file);
    } catch (error) {
      console.error('Error uploading image:', error);
      setIsUploading(false);
      alert('Failed to upload image');
    }
  };

  const handleUrlSubmit = () => {
    if (!imageUrl.trim()) return;

    // Create an image to get dimensions
    const img = new Image();
    img.onload = () => {
      onImageSelect(imageUrl, img.width, img.height);
      setImageUrl('');
      onClose();
    };
    img.onerror = () => {
      alert('Failed to load image from URL. Please check the URL and try again.');
    };
    img.src = imageUrl;
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content image-upload-modal" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h3>Add Image</h3>
          <button className="modal-close-btn" onClick={onClose}>×</button>
        </div>

        <div className="modal-body">
          {/* File Upload */}
          <div className="image-upload-section">
            <label htmlFor="image-file-input" className="image-upload-label">
              📁 Upload from Computer
            </label>
            <input
              type="file"
              id="image-file-input"
              accept="image/*"
              onChange={handleFileSelect}
              style={{ display: 'none' }}
              disabled={isUploading}
            />
            <label htmlFor="image-file-input" className="image-upload-btn">
              {isUploading ? 'Uploading...' : 'Choose File'}
            </label>
          </div>

          <div className="modal-divider">
            <span>or</span>
          </div>

          {/* URL Input */}
          <div className="image-upload-section">
            <label className="image-upload-label">
              🔗 Paste Image URL
            </label>
            <input
              type="url"
              className="image-url-input"
              placeholder="https://example.com/image.jpg"
              value={imageUrl}
              onChange={(e) => setImageUrl(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter') {
                  handleUrlSubmit();
                }
              }}
            />
            <button
              className="image-url-submit-btn"
              onClick={handleUrlSubmit}
              disabled={!imageUrl.trim()}
            >
              Add Image
            </button>
          </div>

          <div className="image-upload-hint">
            Supports: JPG, PNG, GIF, WebP • Max recommended: 10MB
          </div>
        </div>
      </div>
    </div>
  );
};

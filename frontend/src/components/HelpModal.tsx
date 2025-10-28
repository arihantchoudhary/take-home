import React from 'react';

interface HelpModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const HelpModal: React.FC<HelpModalProps> = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  return (
    <div className="help-modal-overlay" onClick={onClose}>
      <div className="help-modal" onClick={(e) => e.stopPropagation()}>
        <div className="help-modal-header">
          <h2>✨ Features Guide</h2>
          <button className="help-close-btn" onClick={onClose}>
            ×
          </button>
        </div>

        <div className="help-modal-content">
          <section className="help-section">
            <h3>📝 Block Editing</h3>
            <ul>
              <li><strong>Inline Editing:</strong> Click on any text block to edit directly - no modals needed!</li>
              <li><strong>Auto-focus:</strong> Empty blocks automatically get focus so you can start typing immediately</li>
              <li><strong>Click-to-add:</strong> Click anywhere in the empty space to create a new block</li>
              <li><strong>Delete blocks:</strong> Hover over a block to see the delete button</li>
            </ul>
          </section>

          <section className="help-section">
            <h3>⚡ Slash Commands</h3>
            <ul>
              <li><strong>Type "/"</strong> to open the block type menu</li>
              <li><strong>Arrow keys</strong> to navigate options</li>
              <li><strong>Enter</strong> to select a block type</li>
              <li><strong>Escape</strong> to close the menu</li>
              <li><strong>Available types:</strong> Text, Heading 1, Heading 2, Heading 3, Image</li>
            </ul>
          </section>

          <section className="help-section">
            <h3>🎨 Page Customization</h3>
            <ul>
              <li><strong>Page Icon:</strong> Click the emoji icon to change it (click outside to close picker)</li>
              <li><strong>Page Title:</strong> Click the title to edit it inline</li>
              <li><strong>Cover Image:</strong> Add beautiful cover images to your pages using the "Add Cover" button</li>
              <li><strong>Remove Cover:</strong> Hover over the cover image to see the remove button</li>
            </ul>
          </section>

          <section className="help-section">
            <h3>🖼️ Images</h3>
            <ul>
              <li><strong>Add images:</strong> Use slash command "/" and select "Image"</li>
              <li><strong>Image URL:</strong> Paste any image URL (supports HTTPS links)</li>
              <li><strong>Unsplash support:</strong> Try URLs like unsplash.com/photos/[photo-id]</li>
            </ul>
          </section>

          <section className="help-section">
            <h3>⚙️ Technical Features</h3>
            <ul>
              <li><strong>Auto-save:</strong> All changes are automatically saved to the backend</li>
              <li><strong>File-based storage:</strong> Uses simple JSON file storage for reliability</li>
              <li><strong>Optimistic UI:</strong> Updates appear instantly while saving in the background</li>
              <li><strong>Error handling:</strong> Graceful error messages if something goes wrong</li>
            </ul>
          </section>

          <section className="help-section">
            <h3>🎯 UI/UX Highlights</h3>
            <ul>
              <li><strong>Notion-inspired design:</strong> Clean, minimal, and distraction-free</li>
              <li><strong>Hover interactions:</strong> Actions appear smoothly when you need them</li>
              <li><strong>Responsive:</strong> Works beautifully on all screen sizes</li>
              <li><strong>Smooth animations:</strong> Subtle transitions for a polished feel</li>
              <li><strong>Apple-style scrollbars:</strong> Sleek, minimal scrollbar design</li>
            </ul>
          </section>

          <section className="help-section">
            <h3>⌨️ Keyboard Shortcuts</h3>
            <ul>
              <li><strong>/</strong> - Open block type menu</li>
              <li><strong>↑/↓</strong> - Navigate slash menu</li>
              <li><strong>Enter</strong> - Select menu item / Create new line</li>
              <li><strong>Escape</strong> - Close slash menu or emoji picker</li>
            </ul>
          </section>

          <section className="help-section help-footer">
            <p>🤖 Built with React, TypeScript, and Express</p>
            <p>💡 <strong>Tip:</strong> Just start typing to create your first block!</p>
          </section>
        </div>
      </div>
    </div>
  );
};

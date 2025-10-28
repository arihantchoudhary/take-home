import React from 'react';

interface EmojiPickerModalProps {
  isOpen: boolean;
  currentEmoji: string;
  onSelect: (emoji: string) => void;
  onClose: () => void;
}

const EMOJIS = [
  '📄', '📝', '📌', '📍', '📎', '📋', '📊', '📈', '📉', '🗂️',
  '📁', '📂', '🗃️', '📚', '📖', '📕', '📗', '📘', '📙', '📓',
  '📔', '📒', '📰', '🗞️', '💡', '🔥', '✨', '🎯', '🎨', '🎭',
  '🎪', '🎬', '🎮', '⚡', '🌟', '🚀', '🎉', '🎊', '🎁', '🏆',
  '🥇', '🥈', '🥉', '💎', '👑', '🎓', '💼', '🔬', '🔭', '🏀',
  '⚽', '🏈', '⚾', '🎾', '🏐', '🏉', '🎱', '🏓', '🏸', '🥊',
  '🖼️', '🎨', '📷', '📹', '🎥', '📺', '📻', '🎙️', '🎚️', '🎛️',
  '⏱️', '⏰', '⏲️', '🕰️', '⌚', '📱', '💻', '⌨️', '🖥️', '🖨️',
  '🖱️', '🖲️', '🕹️', '💾', '💿', '📀', '🧮', '✏️', '✒️', '🖊️',
  '🖋️', '📏', '📐', '🌍', '🌎', '🌏', '🗺️', '🧭', '⛰️', '🏔️',
  '🗻', '🏕️', '🏖️', '🏝️', '🏜️', '🏞️', '🏟️', '🏛️', '🏗️', '🏘️',
  '🏚️', '🏠', '🏡', '🍎', '🍊', '🍋', '🍌', '🍉', '🍇', '🍓',
  '🍈', '🍒', '🍑', '🥭', '🍍', '🥥', '🥝', '🍅', '🥑', '🥦',
  '🥬', '🥒', '🌶️', '🌽', '🥕', '🧄', '🧅', '🥔', '🍠', '🥐',
  '🥯', '🍞', '🥖', '🐶', '🐱', '🐭', '🐹', '🐰', '🦊', '🐻',
  '🐼', '🐨', '🐯', '🦁', '🐮', '🐷', '🐸', '🐵', '🐔', '🐧',
  '🐦', '🐤', '🦆', '🦅', '🦉', '🦇', '🐺', '🐗', '🐴', '🦄',
  '🐝', '🐛', '🦋', '🐌', '🐞', '🐜', '🦟', '🦗', '🕷️', '🦂',
  '🐢', '🐍', '🦎', '🦖', '🦕', '🐙', '🦑', '🦐', '🦞', '🦀',
  '🐡', '🐠', '🐟', '🐬', '🐳', '🐋', '🦈', '🐊', '🐅', '🐆',
  '🦓', '🦍', '🦧', '💙', '💚', '💛', '🧡', '❤️', '💜', '🖤',
  '🤍', '🤎', '💔', '❣️', '💕', '💞', '💓', '💗', '💖', '💘',
  '💝', '⭐', '🌟', '✨', '⚡', '🔥', '💥', '☀️', '🌙', '⭐'
];

export const EmojiPickerModal: React.FC<EmojiPickerModalProps> = ({
  isOpen,
  currentEmoji,
  onSelect,
  onClose,
}) => {
  if (!isOpen) return null;

  return (
    <div className="emoji-modal-overlay" onClick={onClose}>
      <div className="emoji-modal" onClick={(e) => e.stopPropagation()}>
        <div className="emoji-modal-header">
          <h3>Choose an Icon</h3>
          <button className="emoji-modal-close" onClick={onClose}>×</button>
        </div>

        <div className="emoji-modal-current">
          <span className="emoji-current-label">Current:</span>
          <span className="emoji-current-icon">{currentEmoji}</span>
        </div>

        <div className="emoji-modal-grid">
          {EMOJIS.map((emoji) => (
            <button
              key={emoji}
              className={`emoji-modal-option ${emoji === currentEmoji ? 'selected' : ''}`}
              onClick={() => {
                console.log('[EMOJI_MODAL] 😀 Emoji selected:', emoji);
                onSelect(emoji);
                onClose();
              }}
            >
              {emoji}
            </button>
          ))}
        </div>
      </div>

      <style>{`
        .emoji-modal-overlay {
          position: fixed;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background: rgba(0, 0, 0, 0.5);
          backdrop-filter: blur(4px);
          display: flex;
          align-items: center;
          justify-content: center;
          z-index: 9999;
          animation: fadeIn 0.2s ease;
        }

        @keyframes fadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }

        .emoji-modal {
          background: white;
          border-radius: 12px;
          width: 90%;
          max-width: 480px;
          max-height: 80vh;
          display: flex;
          flex-direction: column;
          box-shadow: 0 20px 60px rgba(0, 0, 0, 0.3);
          animation: slideUp 0.3s ease;
        }

        @keyframes slideUp {
          from {
            opacity: 0;
            transform: translateY(20px) scale(0.95);
          }
          to {
            opacity: 1;
            transform: translateY(0) scale(1);
          }
        }

        .emoji-modal-header {
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding: 20px 24px;
          border-bottom: 1px solid rgba(55, 53, 47, 0.09);
        }

        .emoji-modal-header h3 {
          margin: 0;
          font-size: 20px;
          font-weight: 600;
          color: #37352f;
        }

        .emoji-modal-close {
          width: 32px;
          height: 32px;
          border-radius: 4px;
          border: none;
          background: transparent;
          color: rgba(55, 53, 47, 0.5);
          font-size: 28px;
          cursor: pointer;
          display: flex;
          align-items: center;
          justify-content: center;
          transition: all 0.12s ease;
          line-height: 1;
          padding: 0;
        }

        .emoji-modal-close:hover {
          background: rgba(55, 53, 47, 0.08);
          color: rgba(55, 53, 47, 0.8);
        }

        .emoji-modal-current {
          display: flex;
          align-items: center;
          gap: 12px;
          padding: 16px 24px;
          background: rgba(35, 131, 226, 0.05);
          border-bottom: 1px solid rgba(55, 53, 47, 0.09);
        }

        .emoji-current-label {
          font-size: 14px;
          color: rgba(55, 53, 47, 0.7);
          font-weight: 500;
        }

        .emoji-current-icon {
          font-size: 32px;
        }

        .emoji-modal-grid {
          padding: 20px;
          display: grid;
          grid-template-columns: repeat(8, 1fr);
          gap: 8px;
          overflow-y: auto;
          max-height: 400px;
        }

        .emoji-modal-option {
          width: 44px;
          height: 44px;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 28px;
          background: white;
          border: 2px solid transparent;
          border-radius: 8px;
          cursor: pointer;
          transition: all 0.12s ease;
        }

        .emoji-modal-option:hover {
          background: rgba(35, 131, 226, 0.08);
          border-color: rgba(35, 131, 226, 0.2);
          transform: scale(1.1);
        }

        .emoji-modal-option.selected {
          background: rgba(35, 131, 226, 0.15);
          border-color: rgba(35, 131, 226, 0.5);
        }

        @media (max-width: 768px) {
          .emoji-modal {
            max-width: 95%;
          }

          .emoji-modal-grid {
            grid-template-columns: repeat(6, 1fr);
            gap: 6px;
          }

          .emoji-modal-option {
            width: 40px;
            height: 40px;
            font-size: 24px;
          }
        }
      `}</style>
    </div>
  );
};

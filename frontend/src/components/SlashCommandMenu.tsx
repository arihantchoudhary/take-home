import React, { useEffect, useRef } from 'react';
import type { TextType } from '../types';

interface MenuItem {
  id: string;
  label: string;
  description: string;
  icon: string;
  type: 'text' | 'image';
  textType?: TextType;
}

const MENU_ITEMS: MenuItem[] = [
  {
    id: 'text',
    label: 'Text',
    description: 'Just start writing with plain text.',
    icon: '📝',
    type: 'text',
    textType: 'paragraph',
  },
  {
    id: 'h1',
    label: 'Heading 1',
    description: 'Big section heading.',
    icon: '📌',
    type: 'text',
    textType: 'h1',
  },
  {
    id: 'h2',
    label: 'Heading 2',
    description: 'Medium section heading.',
    icon: '📍',
    type: 'text',
    textType: 'h2',
  },
  {
    id: 'h3',
    label: 'Heading 3',
    description: 'Small section heading.',
    icon: '📎',
    type: 'text',
    textType: 'h3',
  },
  {
    id: 'image',
    label: 'Image',
    description: 'Upload or embed with a link.',
    icon: '🖼️',
    type: 'image',
  },
];

interface SlashCommandMenuProps {
  position: { top: number; left: number };
  onSelect: (item: MenuItem) => void;
  onClose: () => void;
  filter?: string;
}

export const SlashCommandMenu: React.FC<SlashCommandMenuProps> = ({
  position,
  onSelect,
  onClose,
  filter = '',
}) => {
  const menuRef = useRef<HTMLDivElement>(null);
  const [selectedIndex, setSelectedIndex] = React.useState(0);

  const filteredItems = MENU_ITEMS.filter(
    (item) =>
      filter === '' ||
      item.label.toLowerCase().includes(filter.toLowerCase()) ||
      item.description.toLowerCase().includes(filter.toLowerCase())
  );

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'ArrowDown') {
        e.preventDefault();
        setSelectedIndex((prev) => (prev + 1) % filteredItems.length);
      } else if (e.key === 'ArrowUp') {
        e.preventDefault();
        setSelectedIndex((prev) => (prev - 1 + filteredItems.length) % filteredItems.length);
      } else if (e.key === 'Enter') {
        e.preventDefault();
        if (filteredItems[selectedIndex]) {
          onSelect(filteredItems[selectedIndex]);
        }
      } else if (e.key === 'Escape') {
        e.preventDefault();
        onClose();
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [selectedIndex, filteredItems, onSelect, onClose]);

  useEffect(() => {
    setSelectedIndex(0);
  }, [filter]);

  if (filteredItems.length === 0) {
    return null;
  }

  return (
    <div
      ref={menuRef}
      className="slash-menu"
      style={{
        position: 'fixed',
        top: `${position.top}px`,
        left: `${position.left}px`,
      }}
    >
      {filteredItems.map((item, index) => (
        <div
          key={item.id}
          className={`slash-menu-item ${index === selectedIndex ? 'selected' : ''}`}
          onClick={(e) => {
            e.preventDefault();
            e.stopPropagation();
            onSelect(item);
          }}
          onMouseDown={(e) => {
            e.preventDefault();
            e.stopPropagation();
          }}
          onMouseEnter={() => setSelectedIndex(index)}
        >
          <span className="slash-menu-icon">{item.icon}</span>
          <div className="slash-menu-content">
            <div className="slash-menu-label">{item.label}</div>
            <div className="slash-menu-description">{item.description}</div>
          </div>
        </div>
      ))}
    </div>
  );
};

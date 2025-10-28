import { useState, useEffect } from 'react';
import { Plus, Loader2 } from 'lucide-react';
import type { Block } from './types';
import { BlockRenderer } from './components/BlockRenderer';
import { BlockEditor } from './components/BlockEditor';
import * as api from './api';
import './App.css';

function App() {
  const [blocks, setBlocks] = useState<Block[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isEditorOpen, setIsEditorOpen] = useState(false);
  const [editingBlock, setEditingBlock] = useState<Block | undefined>(undefined);

  useEffect(() => {
    loadBlocks();
  }, []);

  const loadBlocks = async () => {
    try {
      setLoading(true);
      setError(null);
      const fetchedBlocks = await api.fetchBlocks();
      setBlocks(fetchedBlocks);
    } catch (err) {
      setError('Failed to load blocks');
      console.error('Error loading blocks:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleAddBlock = () => {
    setEditingBlock(undefined);
    setIsEditorOpen(true);
  };

  const handleEditBlock = (block: Block) => {
    setEditingBlock(block);
    setIsEditorOpen(true);
  };

  const handleSaveBlock = async (block: Block) => {
    try {
      if (editingBlock) {
        await api.updateBlock(block.id, block);
      } else {
        await api.createBlock(block);
      }
      await loadBlocks();
      setIsEditorOpen(false);
      setEditingBlock(undefined);
    } catch (err) {
      alert('Failed to save block');
      console.error('Error saving block:', err);
    }
  };

  const handleDeleteBlock = async (id: string) => {
    if (!confirm('Delete this block?')) return;
    try {
      await api.deleteBlock(id);
      await loadBlocks();
    } catch (err) {
      alert('Failed to delete block');
      console.error('Error deleting block:', err);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-background">
        <div className="flex items-center gap-2 text-muted-foreground">
          <Loader2 className="h-4 w-4 animate-spin" />
          <span className="text-sm">Loading...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Notion-style header */}
      <header className="fixed top-0 left-0 right-0 h-[45px] bg-background/80 backdrop-blur-sm border-b border-border z-10">
        <div className="max-w-[900px] mx-auto h-full px-6 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <h1 className="text-sm font-medium text-foreground">Notion Clone</h1>
          </div>
          <button
            onClick={handleAddBlock}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 text-sm font-medium rounded-md bg-primary text-primary-foreground hover:bg-primary/90 transition-colors"
          >
            <Plus className="h-4 w-4" />
            New Block
          </button>
        </div>
      </header>

      {/* Main content with Notion-style spacing */}
      <main className="pt-[45px]">
        <div className="notion-page">
          {error && (
            <div className="mb-6 p-4 rounded-lg bg-destructive/10 border border-destructive/20 text-destructive text-sm">
              {error}
            </div>
          )}

          <div className="mb-8">
            <div className="text-6xl mb-2">📄</div>
            <h1 className="text-4xl font-bold text-foreground outline-none border-none" contentEditable suppressContentEditableWarning>
              Untitled
            </h1>
          </div>

          {blocks.length === 0 ? (
            <div className="flex flex-col items-start py-2">
              <button
                onClick={handleAddBlock}
                className="text-sm text-muted-foreground hover:text-foreground transition-colors"
              >
                Click to add a block or press <kbd className="px-1.5 py-0.5 text-xs bg-muted rounded">+</kbd>
              </button>
            </div>
          ) : (
            <div className="space-y-1">
              {blocks.map((block) => (
                <BlockRenderer
                  key={block.id}
                  block={block}
                  onEdit={handleEditBlock}
                  onDelete={handleDeleteBlock}
                />
              ))}
              <button
                onClick={handleAddBlock}
                className="notion-block w-full text-left text-sm text-muted-foreground hover:text-foreground transition-colors py-2"
              >
                + Add a block
              </button>
            </div>
          )}
        </div>
      </main>

      {isEditorOpen && (
        <BlockEditor
          block={editingBlock}
          onSave={handleSaveBlock}
          onCancel={() => {
            setIsEditorOpen(false);
            setEditingBlock(undefined);
          }}
        />
      )}
    </div>
  );
}

export default App;

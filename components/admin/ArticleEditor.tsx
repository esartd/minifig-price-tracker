'use client';

import { useState } from 'react';
import { ArticleBlock, ArticleBlockType } from '@/types/article';
import { HeadingBlockEditor } from './blocks/HeadingBlockEditor';
import { ParagraphBlockEditor } from './blocks/ParagraphBlockEditor';
import { ImageBlockEditor } from './blocks/ImageBlockEditor';
import { AmazonProductsBlockEditor } from './blocks/AmazonProductsBlockEditor';
import { CalloutBlockEditor } from './blocks/CalloutBlockEditor';
import { ComparisonBlockEditor } from './blocks/ComparisonBlockEditor';
import { ListBlockEditor } from './blocks/ListBlockEditor';
import { DividerBlockEditor } from './blocks/DividerBlockEditor';
import { CodeBlockEditor } from './blocks/CodeBlockEditor';
import { VideoBlockEditor } from './blocks/VideoBlockEditor';
import { BlockToolbar } from './BlockToolbar';

interface ArticleEditorProps {
  initialBlocks: ArticleBlock[];
  onChange: (blocks: ArticleBlock[]) => void;
}

export function ArticleEditor({ initialBlocks, onChange }: ArticleEditorProps) {
  const [blocks, setBlocks] = useState<ArticleBlock[]>(initialBlocks);
  const [selectedBlockId, setSelectedBlockId] = useState<string | null>(null);

  const updateBlocks = (newBlocks: ArticleBlock[]) => {
    setBlocks(newBlocks);
    onChange(newBlocks);
  };

  const updateBlock = (id: string, updates: Partial<ArticleBlock>) => {
    updateBlocks(
      blocks.map(block => block.id === id ? { ...block, ...updates } as ArticleBlock : block)
    );
  };

  const deleteBlock = (id: string) => {
    updateBlocks(blocks.filter(block => block.id !== id));
  };

  const moveBlock = (id: string, direction: 'up' | 'down') => {
    const index = blocks.findIndex(block => block.id === id);
    if (index === -1) return;
    if (direction === 'up' && index === 0) return;
    if (direction === 'down' && index === blocks.length - 1) return;

    const newBlocks = [...blocks];
    const newIndex = direction === 'up' ? index - 1 : index + 1;
    [newBlocks[index], newBlocks[newIndex]] = [newBlocks[newIndex], newBlocks[index]];
    updateBlocks(newBlocks);
  };

  const addBlock = (type: ArticleBlockType, afterId?: string) => {
    const newBlock: ArticleBlock = {
      id: `block-${Date.now()}-${Math.random()}`,
      type,
      ...(type === 'heading' && { level: 2 as const, text: '' }),
      ...(type === 'paragraph' && { text: '' }),
      ...(type === 'image' && { images: [{ imageId: '', imageUrl: '', alt: '' }], columns: 1 as const }),
      ...(type === 'amazon-products' && { products: [{ asin: '', title: '', imageUrl: '' }], columns: 1 as const }),
      ...(type === 'callout' && { calloutType: 'info' as const, content: '' }),
      ...(type === 'comparison' && { items: [] }),
      ...(type === 'list' && { ordered: false, items: [''] }),
      ...(type === 'code' && { language: 'javascript', code: '' }),
      ...(type === 'video' && { platform: 'youtube' as const, videoUrl: '', videoId: '' }),
    } as ArticleBlock;

    if (afterId) {
      const index = blocks.findIndex(block => block.id === afterId);
      const newBlocks = [...blocks];
      newBlocks.splice(index + 1, 0, newBlock);
      updateBlocks(newBlocks);
    } else {
      updateBlocks([...blocks, newBlock]);
    }

    setSelectedBlockId(newBlock.id);
  };

  const renderBlock = (block: ArticleBlock) => {
    const onChange = (updates: Partial<ArticleBlock>) => updateBlock(block.id, updates);

    switch (block.type) {
      case 'heading':
        return <HeadingBlockEditor key={block.id} block={block} onChange={onChange} />;
      case 'paragraph':
        return <ParagraphBlockEditor key={block.id} block={block} onChange={onChange} />;
      case 'image':
        return <ImageBlockEditor key={block.id} block={block} onChange={onChange} />;
      case 'amazon-products':
        return <AmazonProductsBlockEditor key={block.id} block={block} onChange={onChange} />;
      case 'callout':
        return <CalloutBlockEditor key={block.id} block={block} onChange={onChange} />;
      case 'comparison':
        return <ComparisonBlockEditor key={block.id} block={block} onChange={onChange} />;
      case 'list':
        return <ListBlockEditor key={block.id} block={block} onChange={onChange} />;
      case 'divider':
        return <DividerBlockEditor key={block.id} block={block} onChange={onChange} />;
      case 'code':
        return <CodeBlockEditor key={block.id} block={block} onChange={onChange} />;
      case 'video':
        return <VideoBlockEditor key={block.id} block={block} onChange={onChange} />;
      default:
        return null;
    }
  };

  return (
    <div style={{ maxWidth: '800px', margin: '0 auto' }}>
      {blocks.length === 0 ? (
        <div style={{
          padding: '80px 24px',
          textAlign: 'center',
          background: '#fafafa',
          borderRadius: '12px',
          border: '2px dashed #e5e5e5',
        }}>
          <div style={{ fontSize: '48px', marginBottom: '16px', opacity: 0.3 }}>✍️</div>
          <h3 style={{ fontSize: '18px', fontWeight: '600', color: '#171717', marginBottom: '8px' }}>
            Start writing your article
          </h3>
          <p style={{ fontSize: '15px', color: '#737373', marginBottom: '24px' }}>
            Add blocks to build your content
          </p>
          <BlockToolbar onAddBlock={addBlock} />
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          {blocks.map((block, index) => (
            <div
              key={block.id}
              style={{
                position: 'relative',
                background: '#ffffff',
                border: selectedBlockId === block.id ? '2px solid #3b82f6' : '1px solid #e5e5e5',
                borderRadius: '8px',
                padding: '16px',
                transition: 'border-color 0.2s',
              }}
              onClick={() => setSelectedBlockId(block.id)}
            >
              <div style={{
                position: 'absolute',
                top: '8px',
                right: '8px',
                display: 'flex',
                gap: '4px',
                opacity: selectedBlockId === block.id ? 1 : 0,
                transition: 'opacity 0.2s',
              }}>
                <button
                  onClick={() => moveBlock(block.id, 'up')}
                  disabled={index === 0}
                  style={{
                    padding: '4px 8px',
                    background: '#f3f4f6',
                    border: 'none',
                    borderRadius: '4px',
                    cursor: index === 0 ? 'not-allowed' : 'pointer',
                    opacity: index === 0 ? 0.5 : 1,
                  }}
                >
                  ↑
                </button>
                <button
                  onClick={() => moveBlock(block.id, 'down')}
                  disabled={index === blocks.length - 1}
                  style={{
                    padding: '4px 8px',
                    background: '#f3f4f6',
                    border: 'none',
                    borderRadius: '4px',
                    cursor: index === blocks.length - 1 ? 'not-allowed' : 'pointer',
                    opacity: index === blocks.length - 1 ? 0.5 : 1,
                  }}
                >
                  ↓
                </button>
                <button
                  onClick={() => deleteBlock(block.id)}
                  style={{
                    padding: '4px 8px',
                    background: '#fee2e2',
                    color: '#b91c1c',
                    border: 'none',
                    borderRadius: '4px',
                    cursor: 'pointer',
                  }}
                >
                  🗑
                </button>
              </div>

              {renderBlock(block)}

              {selectedBlockId === block.id && (
                <div style={{ marginTop: '12px', paddingTop: '12px', borderTop: '1px solid #e5e5e5' }}>
                  <BlockToolbar onAddBlock={(type) => addBlock(type, block.id)} />
                </div>
              )}
            </div>
          ))}
        </div>
      )}

      {blocks.length > 0 && (
        <div style={{ marginTop: '16px' }}>
          <BlockToolbar onAddBlock={addBlock} />
        </div>
      )}
    </div>
  );
}

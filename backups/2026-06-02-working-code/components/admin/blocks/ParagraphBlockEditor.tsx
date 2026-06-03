'use client';

import { ParagraphBlock } from '@/types/article';

interface ParagraphBlockEditorProps {
  block: ParagraphBlock;
  onChange: (updates: Partial<ParagraphBlock>) => void;
}

export function ParagraphBlockEditor({ block, onChange }: ParagraphBlockEditorProps) {
  return (
    <textarea
      value={block.text}
      onChange={(e) => onChange({ text: e.target.value })}
      placeholder="Write your paragraph here... (Supports **bold** and *italic* markdown)"
      style={{
        width: '100%',
        minHeight: '120px',
        padding: '12px',
        fontSize: '16px',
        lineHeight: '1.75',
        border: 'none',
        outline: 'none',
        background: 'transparent',
        color: '#3c4043',
        resize: 'vertical',
        fontFamily: 'inherit',
      }}
    />
  );
}

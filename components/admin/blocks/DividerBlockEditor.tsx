'use client';

import { DividerBlock } from '@/types/article';

interface DividerBlockEditorProps {
  block: DividerBlock;
  onChange: (updates: Partial<DividerBlock>) => void;
}

export function DividerBlockEditor({ block, onChange }: DividerBlockEditorProps) {
  return (
    <div style={{
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '20px 0',
    }}>
      <hr style={{
        width: '100%',
        border: 'none',
        borderTop: '1px solid #e5e5e5',
      }} />
    </div>
  );
}

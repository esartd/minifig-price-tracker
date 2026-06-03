'use client';

import { CodeBlock } from '@/types/article';

interface CodeBlockEditorProps {
  block: CodeBlock;
  onChange: (updates: Partial<CodeBlock>) => void;
}

export function CodeBlockEditor({ block, onChange }: CodeBlockEditorProps) {
  const languages = [
    'javascript', 'typescript', 'python', 'java', 'go', 'rust',
    'html', 'css', 'json', 'sql', 'bash', 'plaintext'
  ];

  return (
    <div style={{
      background: '#ffffff',
      border: '1px solid #e5e5e5',
      borderRadius: '12px',
      padding: '20px',
    }}>
      <div style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: '16px',
        flexWrap: 'wrap',
        gap: '8px',
      }}>
        <div style={{
          fontSize: '14px',
          fontWeight: '600',
          color: '#171717',
        }}>
          💻 Code Block
        </div>
        <select
          value={block.language}
          onChange={(e) => onChange({ language: e.target.value })}
          style={{
            padding: '6px 12px',
            fontSize: '13px',
            border: '1px solid #e5e5e5',
            borderRadius: '6px',
            background: '#f9fafb',
            cursor: 'pointer',
          }}
        >
          {languages.map(lang => (
            <option key={lang} value={lang}>
              {lang.charAt(0).toUpperCase() + lang.slice(1)}
            </option>
          ))}
        </select>
      </div>

      <textarea
        value={block.code}
        onChange={(e) => onChange({ code: e.target.value })}
        placeholder="Paste or type your code here..."
        style={{
          width: '100%',
          minHeight: '200px',
          padding: '16px',
          fontSize: '14px',
          fontFamily: 'Monaco, Consolas, "Courier New", monospace',
          lineHeight: '1.6',
          border: '1px solid #e5e5e5',
          borderRadius: '8px',
          background: '#f9fafb',
          resize: 'vertical',
        }}
      />

      <input
        type="text"
        value={block.caption || ''}
        onChange={(e) => onChange({ caption: e.target.value })}
        placeholder="Optional caption (e.g., 'Example usage' or 'Output')"
        style={{
          width: '100%',
          marginTop: '12px',
          padding: '10px 12px',
          fontSize: '13px',
          border: '1px solid #e5e5e5',
          borderRadius: '6px',
          background: '#ffffff',
        }}
      />

      {block.showLineNumbers !== undefined && (
        <label style={{
          display: 'flex',
          alignItems: 'center',
          gap: '8px',
          marginTop: '12px',
          fontSize: '13px',
          color: '#737373',
          cursor: 'pointer',
        }}>
          <input
            type="checkbox"
            checked={block.showLineNumbers}
            onChange={(e) => onChange({ showLineNumbers: e.target.checked })}
            style={{ cursor: 'pointer' }}
          />
          Show line numbers
        </label>
      )}
    </div>
  );
}

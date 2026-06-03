'use client';

import { CTAButtonBlock } from '@/types/article';

interface CTAButtonBlockEditorProps {
  block: CTAButtonBlock;
  onChange: (updates: Partial<CTAButtonBlock>) => void;
}

export function CTAButtonBlockEditor({ block, onChange }: CTAButtonBlockEditorProps) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
      <div style={{
        fontSize: '12px',
        fontWeight: '600',
        color: '#737373',
        textTransform: 'uppercase',
        letterSpacing: '0.5px',
      }}>
        CTA Button
      </div>

      <input
        type="text"
        value={block.text}
        onChange={(e) => onChange({ text: e.target.value })}
        placeholder="Button text (e.g., Start Tracking Your Collection)"
        style={{
          padding: '10px 14px',
          fontSize: '15px',
          border: '1px solid #e5e5e5',
          borderRadius: '8px',
          outline: 'none',
        }}
      />

      <input
        type="text"
        value={block.url}
        onChange={(e) => onChange({ url: e.target.value })}
        placeholder="URL (e.g., /search or https://...)"
        style={{
          padding: '10px 14px',
          fontSize: '15px',
          border: '1px solid #e5e5e5',
          borderRadius: '8px',
          outline: 'none',
        }}
      />

      <div style={{ display: 'flex', gap: '12px' }}>
        <div style={{ flex: 1 }}>
          <label style={{
            display: 'block',
            fontSize: '13px',
            fontWeight: '500',
            color: '#525252',
            marginBottom: '6px',
          }}>
            Style
          </label>
          <select
            value={block.style || 'primary'}
            onChange={(e) => onChange({ style: e.target.value as 'primary' | 'secondary' })}
            style={{
              width: '100%',
              padding: '10px 14px',
              fontSize: '15px',
              border: '1px solid #e5e5e5',
              borderRadius: '8px',
              background: '#ffffff',
              outline: 'none',
            }}
          >
            <option value="primary">Primary (Blue)</option>
            <option value="secondary">Secondary (Gray)</option>
          </select>
        </div>

        <div style={{ flex: 1 }}>
          <label style={{
            display: 'block',
            fontSize: '13px',
            fontWeight: '500',
            color: '#525252',
            marginBottom: '6px',
          }}>
            Size
          </label>
          <select
            value={block.size || 'large'}
            onChange={(e) => onChange({ size: e.target.value as 'small' | 'medium' | 'large' })}
            style={{
              width: '100%',
              padding: '10px 14px',
              fontSize: '15px',
              border: '1px solid #e5e5e5',
              borderRadius: '8px',
              background: '#ffffff',
              outline: 'none',
            }}
          >
            <option value="small">Small</option>
            <option value="medium">Medium</option>
            <option value="large">Large</option>
          </select>
        </div>

        <div style={{ flex: 1 }}>
          <label style={{
            display: 'block',
            fontSize: '13px',
            fontWeight: '500',
            color: '#525252',
            marginBottom: '6px',
          }}>
            Alignment
          </label>
          <select
            value={block.alignment || 'center'}
            onChange={(e) => onChange({ alignment: e.target.value as 'left' | 'center' | 'right' })}
            style={{
              width: '100%',
              padding: '10px 14px',
              fontSize: '15px',
              border: '1px solid #e5e5e5',
              borderRadius: '8px',
              background: '#ffffff',
              outline: 'none',
            }}
          >
            <option value="left">Left</option>
            <option value="center">Center</option>
            <option value="right">Right</option>
          </select>
        </div>
      </div>

      {/* Preview */}
      <div style={{
        padding: '24px',
        background: '#fafafa',
        borderRadius: '8px',
        marginTop: '8px',
      }}>
        <div style={{
          fontSize: '12px',
          fontWeight: '600',
          color: '#737373',
          marginBottom: '12px',
          textTransform: 'uppercase',
          letterSpacing: '0.5px',
        }}>
          Preview
        </div>
        <div style={{
          display: 'flex',
          justifyContent: block.alignment === 'left' ? 'flex-start' : block.alignment === 'right' ? 'flex-end' : 'center',
        }}>
          <div style={{
            display: 'inline-flex',
            alignItems: 'center',
            justifyContent: 'center',
            padding: block.size === 'small' ? '10px 20px' : block.size === 'medium' ? '12px 28px' : '16px 40px',
            fontSize: block.size === 'small' ? '14px' : block.size === 'medium' ? '15px' : '17px',
            background: block.style === 'primary' ? '#3b82f6' : '#f3f4f6',
            color: block.style === 'primary' ? '#ffffff' : '#171717',
            borderRadius: '12px',
            fontWeight: '600',
          }}>
            {block.text || 'Button Text'}
          </div>
        </div>
      </div>
    </div>
  );
}

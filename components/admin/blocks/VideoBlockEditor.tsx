'use client';

import { VideoBlock } from '@/types/article';
import { useState } from 'react';

interface VideoBlockEditorProps {
  block: VideoBlock;
  onChange: (updates: Partial<VideoBlock>) => void;
}

export function VideoBlockEditor({ block, onChange }: VideoBlockEditorProps) {
  const [urlInput, setUrlInput] = useState(block.videoUrl);

  const handleUrlChange = (url: string) => {
    setUrlInput(url);

    // Extract video ID and platform from URL
    let platform: 'youtube' | 'vimeo' | 'other' = 'other';
    let videoId = '';

    if (url.includes('youtube.com') || url.includes('youtu.be')) {
      platform = 'youtube';
      const match = url.match(/(?:youtube\.com\/(?:[^\/]+\/.+\/|(?:v|e(?:mbed)?)\/|.*[?&]v=)|youtu\.be\/)([^"&?\/\s]{11})/);
      if (match) videoId = match[1];
    } else if (url.includes('vimeo.com')) {
      platform = 'vimeo';
      const match = url.match(/vimeo\.com\/(?:video\/)?(\d+)/);
      if (match) videoId = match[1];
    }

    onChange({
      videoUrl: url,
      platform,
      videoId: videoId || url,
    });
  };

  const getEmbedUrl = () => {
    if (!block.videoId) return '';

    switch (block.platform) {
      case 'youtube':
        return `https://www.youtube.com/embed/${block.videoId}`;
      case 'vimeo':
        return `https://player.vimeo.com/video/${block.videoId}`;
      default:
        return block.videoUrl;
    }
  };

  return (
    <div style={{
      background: '#ffffff',
      border: '1px solid #e5e5e5',
      borderRadius: '12px',
      padding: '20px',
    }}>
      <div style={{
        fontSize: '14px',
        fontWeight: '600',
        color: '#171717',
        marginBottom: '16px',
      }}>
        🎥 Video Block
      </div>

      <input
        type="text"
        value={urlInput}
        onChange={(e) => handleUrlChange(e.target.value)}
        placeholder="Paste YouTube or Vimeo URL..."
        style={{
          width: '100%',
          padding: '12px',
          fontSize: '14px',
          border: '1px solid #e5e5e5',
          borderRadius: '8px',
          background: '#ffffff',
          marginBottom: '12px',
        }}
      />

      {block.videoId && (
        <div style={{
          position: 'relative',
          paddingBottom: '56.25%', // 16:9 aspect ratio
          height: 0,
          overflow: 'hidden',
          borderRadius: '8px',
          marginBottom: '12px',
        }}>
          <iframe
            src={getEmbedUrl()}
            style={{
              position: 'absolute',
              top: 0,
              left: 0,
              width: '100%',
              height: '100%',
              border: 'none',
            }}
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
          />
        </div>
      )}

      <input
        type="text"
        value={block.caption || ''}
        onChange={(e) => onChange({ caption: e.target.value })}
        placeholder="Optional caption"
        style={{
          width: '100%',
          padding: '10px 12px',
          fontSize: '13px',
          border: '1px solid #e5e5e5',
          borderRadius: '6px',
          background: '#ffffff',
        }}
      />

      {block.platform && block.videoId && (
        <div style={{
          marginTop: '12px',
          fontSize: '12px',
          color: '#10b981',
        }}>
          ✓ Detected {block.platform === 'youtube' ? 'YouTube' : 'Vimeo'} video
        </div>
      )}
    </div>
  );
}

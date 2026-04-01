'use client';

interface LightboxProps {
  imageUrl: string;
  imageName: string;
  onClose: () => void;
}

export default function Lightbox({ imageUrl, imageName, onClose }: LightboxProps) {
  return (
    <div
      onClick={onClose}
      className="fixed inset-0 z-[9999] flex items-center justify-center p-10 cursor-zoom-out"
      style={{
        background: 'rgba(0, 0, 0, 0.9)',
        backdropFilter: 'blur(10px)'
      }}
    >
      <div className="relative flex flex-col items-center max-w-[90vw] max-h-[90vh]">
        <img
          src={imageUrl}
          alt={imageName}
          className="max-w-full rounded-xl shadow-2xl"
          style={{
            maxHeight: 'calc(90vh - 60px)',
            objectFit: 'contain'
          }}
        />
        <div className="mt-5 text-white text-base font-medium text-center" style={{ textShadow: '0 2px 4px rgba(0, 0, 0, 0.5)' }}>
          {imageName}
        </div>
        <button
          onClick={onClose}
          className="absolute -top-12 -right-12 w-10 h-10 rounded-full flex items-center justify-center text-white text-2xl"
          style={{
            background: 'rgba(255, 255, 255, 0.2)',
            border: '1px solid rgba(255, 255, 255, 0.3)',
            backdropFilter: 'blur(10px)'
          }}
        >
          ×
        </button>
      </div>
    </div>
  );
}

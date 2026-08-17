'use client';

import { useRef, useState } from 'react';
import Link from 'next/link';
import imageCompression from 'browser-image-compression';
import { useTranslation } from '@/components/TranslationProvider';
import { formatPrice } from '@/lib/format-price';

type Status = 'idle' | 'processing' | 'result' | 'error';
type PartKey = 'head' | 'torso' | 'legs' | 'hair';

interface PartGuess {
  itemNo: string;
  name: string;
  confidence: number;
  bricklinkUrl: string;
}

interface PrimaryResult {
  itemNo: string;
  name: string;
  confidence: number;
  image_url: string | null;
  category_name: string;
}

interface PricingData {
  suggestedPrice: number;
  currentAverage: number;
  currentLowest: number;
  currencyCode?: string;
  unavailable_reason?: string;
}

interface ScanResponse {
  success?: boolean;
  scanId?: string;
  isMixed?: boolean;
  matched?: boolean;
  message?: string;
  primary?: PrimaryResult;
  pricing?: PricingData | null;
  alternates?: { itemNo: string; name: string; confidence: number }[];
  parts?: Partial<Record<PartKey, PartGuess>>;
  error?: string;
  code?: string;
}

const PART_LABELS: Record<PartKey, string> = {
  head: 'Head',
  torso: 'Torso',
  legs: 'Legs',
  hair: 'Hair / Headgear',
};

export default function MinifigIdentifierWidget() {
  const { t } = useTranslation();
  const [status, setStatus] = useState<Status>('idle');
  const [errorMsg, setErrorMsg] = useState('');
  const [preview, setPreview] = useState<string | null>(null);
  const [result, setResult] = useState<ScanResponse | null>(null);
  const [dragOver, setDragOver] = useState(false);
  const [feedbackGiven, setFeedbackGiven] = useState<Record<string, boolean>>({});
  const [correctionOpenFor, setCorrectionOpenFor] = useState<string | null>(null);
  const [correctionValue, setCorrectionValue] = useState('');
  const fileInputRef = useRef<HTMLInputElement>(null);

  const processFile = async (file: File) => {
    if (!file.type.startsWith('image/')) {
      setStatus('error');
      setErrorMsg(t('identify.errors.notImage') || 'Please choose an image file.');
      return;
    }

    setStatus('processing');
    setErrorMsg('');
    setResult(null);
    setFeedbackGiven({});
    setCorrectionOpenFor(null);
    setPreview(URL.createObjectURL(file));

    try {
      const compressed = await imageCompression(file, {
        maxSizeMB: 3,
        maxWidthOrHeight: 1920,
        useWebWorker: true,
        fileType: 'image/webp',
      });

      const formData = new FormData();
      formData.append('file', compressed);

      const response = await fetch('/api/scan/identify', { method: 'POST', body: formData });
      const data: ScanResponse = await response.json();

      if (!response.ok) {
        setStatus('error');
        if (data.code === 'DAILY_LIMIT_REACHED') {
          setErrorMsg(data.error || t('identify.errors.dailyLimit') || "You've hit today's scan limit. Try again tomorrow.");
        } else {
          setErrorMsg(data.error || t('identify.errors.generic') || 'Something went wrong. Please try again.');
        }
        return;
      }

      setResult(data);
      setStatus('result');
    } catch (err) {
      console.error('[MinifigIdentifierWidget] Error:', err);
      setStatus('error');
      setErrorMsg(t('identify.errors.generic') || 'Something went wrong. Please try again.');
    }
  };

  const handleFileInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) processFile(file);
    e.target.value = '';
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setDragOver(false);
    const file = e.dataTransfer.files?.[0];
    if (file) processFile(file);
  };

  const submitFeedback = async (key: string, part: PartKey | null, wasCorrect: boolean, correctedItemNo?: string) => {
    if (!result?.scanId) return;
    try {
      await fetch(`/api/scan/${result.scanId}/feedback`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(part ? { part, wasCorrect, correctedItemNo } : { wasCorrect, correctedItemNo }),
      });
    } catch (err) {
      console.error('[MinifigIdentifierWidget] Feedback error:', err);
    } finally {
      setFeedbackGiven((prev) => ({ ...prev, [key]: true }));
      setCorrectionOpenFor(null);
      setCorrectionValue('');
    }
  };

  const reset = () => {
    setStatus('idle');
    setResult(null);
    setPreview(null);
    setErrorMsg('');
    setFeedbackGiven({});
    setCorrectionOpenFor(null);
    setCorrectionValue('');
  };

  const dropZoneStyle: React.CSSProperties = {
    border: `2px dashed ${dragOver ? '#171717' : '#e5e5e5'}`,
    borderRadius: '12px',
    padding: '40px 20px',
    textAlign: 'center',
    background: dragOver ? '#fafafa' : '#ffffff',
    transition: 'background 0.15s, border-color 0.15s',
  };

  const feedbackRow = (key: string, part: PartKey | null) => {
    if (feedbackGiven[key]) {
      return (
        <p style={{ margin: '8px 0 0', fontSize: 'var(--text-sm)', color: '#16a34a', fontWeight: 600 }}>
          ✓ {t('identify.feedback.thanks') || 'Thanks for the feedback!'}
        </p>
      );
    }

    if (correctionOpenFor === key) {
      return (
        <div style={{ marginTop: '8px', display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
          <input
            type="text"
            value={correctionValue}
            onChange={(e) => setCorrectionValue(e.target.value)}
            placeholder={t('identify.feedback.correctionPlaceholder') || 'Correct BrickLink ID'}
            style={{
              flex: '1 1 160px',
              padding: '6px 10px',
              fontSize: 'var(--text-sm)',
              border: '1px solid #e5e5e5',
              borderRadius: '6px',
            }}
          />
          <button
            onClick={() => submitFeedback(key, part, false, correctionValue.trim() || undefined)}
            disabled={!correctionValue.trim()}
            style={{
              padding: '6px 12px',
              fontSize: 'var(--text-sm)',
              fontWeight: 600,
              color: '#ffffff',
              background: correctionValue.trim() ? '#171717' : '#a3a3a3',
              border: 'none',
              borderRadius: '6px',
              cursor: correctionValue.trim() ? 'pointer' : 'not-allowed',
            }}
          >
            {t('identify.feedback.submit') || 'Submit'}
          </button>
        </div>
      );
    }

    return (
      <div style={{ marginTop: '8px', display: 'flex', gap: '8px' }}>
        <button
          onClick={() => submitFeedback(key, part, true)}
          style={{
            padding: '6px 12px',
            fontSize: 'var(--text-sm)',
            fontWeight: 600,
            color: '#171717',
            background: '#ffffff',
            border: '1px solid #e5e5e5',
            borderRadius: '6px',
            cursor: 'pointer',
          }}
        >
          ✓ {t('identify.feedback.correct') || "That's right"}
        </button>
        <button
          onClick={() => setCorrectionOpenFor(key)}
          style={{
            padding: '6px 12px',
            fontSize: 'var(--text-sm)',
            fontWeight: 600,
            color: '#171717',
            background: '#ffffff',
            border: '1px solid #e5e5e5',
            borderRadius: '6px',
            cursor: 'pointer',
          }}
        >
          ✗ {t('identify.feedback.incorrect') || 'Not quite'}
        </button>
      </div>
    );
  };

  return (
    <div>
      {status !== 'result' && status !== 'error' && (
        <div
          style={dropZoneStyle}
          onDragOver={(e) => { e.preventDefault(); setDragOver(true); }}
          onDragLeave={() => setDragOver(false)}
          onDrop={handleDrop}
        >
          {status === 'processing' ? (
            <div>
              {preview && (
                // eslint-disable-next-line @next/next/no-img-element
                <img src={preview} alt="" style={{ maxWidth: '160px', maxHeight: '160px', borderRadius: '8px', marginBottom: '12px' }} />
              )}
              <p style={{ margin: 0, fontSize: 'var(--text-sm)', fontWeight: 600, color: '#171717' }}>
                {t('identify.processing') || 'Identifying your minifigure...'}
              </p>
            </div>
          ) : (
            <div>
              <div style={{ fontSize: '40px', marginBottom: '12px', opacity: 0.4 }}>📷</div>
              <p style={{ margin: '0 0 4px', fontSize: 'var(--text-base)', fontWeight: 600, color: '#171717' }}>
                {t('identify.dropzone.title') || 'Drag a photo here, or choose one below'}
              </p>
              <p style={{ margin: '0 0 16px', fontSize: 'var(--text-sm)', color: '#737373' }}>
                {t('identify.dropzone.subtitle') || 'Works best with a clear, well-lit photo of one minifigure'}
              </p>
              <div style={{ display: 'flex', gap: '12px', justifyContent: 'center', flexWrap: 'wrap' }}>
                <label
                  style={{
                    padding: '10px 20px',
                    fontSize: 'var(--text-sm)',
                    fontWeight: 600,
                    color: '#ffffff',
                    background: '#171717',
                    borderRadius: '8px',
                    cursor: 'pointer',
                  }}
                >
                  {t('identify.dropzone.choosePhoto') || 'Choose Photo'}
                  <input ref={fileInputRef} type="file" accept="image/*" onChange={handleFileInputChange} style={{ display: 'none' }} />
                </label>
                <label
                  style={{
                    padding: '10px 20px',
                    fontSize: 'var(--text-sm)',
                    fontWeight: 600,
                    color: '#171717',
                    background: '#ffffff',
                    border: '1px solid #e5e5e5',
                    borderRadius: '8px',
                    cursor: 'pointer',
                  }}
                >
                  {t('identify.dropzone.takePhoto') || 'Take Photo'}
                  <input type="file" accept="image/*" capture="environment" onChange={handleFileInputChange} style={{ display: 'none' }} />
                </label>
              </div>
            </div>
          )}
        </div>
      )}

      {status === 'error' && (
        <div style={{ textAlign: 'center', padding: '24px 20px', border: '1px solid #fde68a', background: '#fffbeb', borderRadius: '12px' }}>
          <p style={{ margin: '0 0 16px', fontSize: 'var(--text-sm)', color: '#92400e' }}>{errorMsg}</p>
          <button
            onClick={reset}
            style={{
              padding: '8px 16px',
              fontSize: 'var(--text-sm)',
              fontWeight: 600,
              color: '#171717',
              background: '#ffffff',
              border: '1px solid #e5e5e5',
              borderRadius: '8px',
              cursor: 'pointer',
            }}
          >
            {t('identify.tryAgain') || 'Try Again'}
          </button>
        </div>
      )}

      {status === 'result' && result && (
        <div>
          {!result.isMixed && result.matched === false && (
            <div style={{ textAlign: 'center', padding: '24px 20px', border: '1px solid #e5e5e5', background: '#fafafa', borderRadius: '12px' }}>
              <p style={{ margin: '0 0 16px', fontSize: 'var(--text-sm)', color: '#737373' }}>
                {result.message || t('identify.noMatch') || "Couldn't confidently identify this minifigure. Try a clearer or closer photo."}
              </p>
              <button onClick={reset} style={{ padding: '8px 16px', fontSize: 'var(--text-sm)', fontWeight: 600, color: '#ffffff', background: '#171717', border: 'none', borderRadius: '8px', cursor: 'pointer' }}>
                {t('identify.tryAgain') || 'Try Again'}
              </button>
            </div>
          )}

          {!result.isMixed && result.matched && result.primary && (
            <div style={{ padding: '20px', border: '1px solid #e5e5e5', borderRadius: '12px', background: '#ffffff' }}>
              <div style={{ display: 'flex', gap: '16px' }}>
                {result.primary.image_url && (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img src={result.primary.image_url} alt={result.primary.name} style={{ width: '72px', height: '72px', objectFit: 'contain', borderRadius: '8px', background: '#fafafa', flexShrink: 0 }} />
                )}
                <div style={{ flex: 1, minWidth: 0 }}>
                  <p style={{ margin: '0 0 2px', fontSize: 'var(--text-base)', fontWeight: 700, color: '#171717' }}>{result.primary.name}</p>
                  <Link href={`/minifigs/${result.primary.itemNo}`} style={{ fontSize: 'var(--text-sm)', color: '#3b82f6', textDecoration: 'none' }}>
                    {t('identify.brickLinkId') || 'BrickLink ID'}: {result.primary.itemNo}
                  </Link>
                  {result.pricing && !result.pricing.unavailable_reason ? (
                    <p style={{ margin: '4px 0 0', fontSize: 'var(--text-lg)', fontWeight: 700, color: '#171717' }}>
                      {formatPrice(result.pricing.suggestedPrice, result.pricing.currencyCode || 'USD')}
                    </p>
                  ) : (
                    <p style={{ margin: '4px 0 0', fontSize: 'var(--text-sm)', color: '#a3a3a3' }}>
                      {t('identify.priceUnavailable') || 'Price unavailable right now'}
                    </p>
                  )}
                </div>
              </div>

              <div style={{ marginTop: '16px', paddingTop: '16px', borderTop: '1px solid #f5f5f5' }}>
                <p style={{ margin: '0 0 4px', fontSize: 'var(--text-sm)', fontWeight: 600, color: '#171717' }}>
                  {t('identify.feedback.isThisRight') || 'Is this right?'}
                </p>
                {feedbackRow('primary', null)}
              </div>

              <button
                onClick={reset}
                style={{
                  marginTop: '16px',
                  padding: '8px 16px',
                  fontSize: 'var(--text-sm)',
                  fontWeight: 600,
                  color: '#171717',
                  background: '#fafafa',
                  border: '1px solid #e5e5e5',
                  borderRadius: '8px',
                  cursor: 'pointer',
                }}
              >
                {t('identify.scanAnother') || 'Scan Another'}
              </button>
            </div>
          )}

          {result.isMixed && (
            <div>
              <div style={{ padding: '12px 16px', marginBottom: '16px', background: '#fafafa', border: '1px solid #e5e5e5', borderRadius: '8px' }}>
                <p style={{ margin: 0, fontSize: 'var(--text-sm)', color: '#171717' }}>
                  {t('identify.mixedBanner') || "Looks like a custom figure — here's our best guess for each part."}
                </p>
              </div>

              {result.parts && Object.keys(result.parts).length === 0 && (
                <p style={{ fontSize: 'var(--text-sm)', color: '#737373' }}>
                  {t('identify.noMatch') || "Couldn't confidently identify this minifigure. Try a clearer or closer photo."}
                </p>
              )}

              <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                {(['head', 'torso', 'legs', 'hair'] as PartKey[]).map((partKey) => {
                  const part = result.parts?.[partKey];
                  if (!part) return null;
                  return (
                    <div key={partKey} style={{ padding: '16px', border: '1px solid #e5e5e5', borderRadius: '12px', background: '#ffffff' }}>
                      <p style={{ margin: '0 0 2px', fontSize: 'var(--text-xs)', fontWeight: 600, color: '#737373', textTransform: 'uppercase', letterSpacing: '0.02em' }}>
                        {PART_LABELS[partKey]}
                      </p>
                      <p style={{ margin: '0 0 2px', fontSize: 'var(--text-base)', fontWeight: 700, color: '#171717' }}>{part.name}</p>
                      <a href={part.bricklinkUrl} target="_blank" rel="noopener noreferrer" style={{ fontSize: 'var(--text-sm)', color: '#3b82f6', textDecoration: 'none' }}>
                        {t('identify.brickLinkId') || 'BrickLink ID'}: {part.itemNo} ↗
                      </a>
                      <p style={{ margin: '4px 0 0', fontSize: 'var(--text-xs)', color: '#a3a3a3' }}>
                        {t('identify.aiEstimateUnverified') || 'AI estimate — unverified'}
                      </p>
                      <div style={{ marginTop: '10px' }}>
                        {feedbackRow(partKey, partKey)}
                      </div>
                    </div>
                  );
                })}
              </div>

              <button
                onClick={reset}
                style={{
                  marginTop: '16px',
                  padding: '8px 16px',
                  fontSize: 'var(--text-sm)',
                  fontWeight: 600,
                  color: '#171717',
                  background: '#fafafa',
                  border: '1px solid #e5e5e5',
                  borderRadius: '8px',
                  cursor: 'pointer',
                }}
              >
                {t('identify.scanAnother') || 'Scan Another'}
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

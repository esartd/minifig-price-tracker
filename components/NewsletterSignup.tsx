'use client';

import { useState } from 'react';

export default function NewsletterSignup() {
  const [email, setEmail] = useState('');
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');
  const [message, setMessage] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus('loading');

    try {
      const response = await fetch('/api/newsletter/subscribe', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email }),
      });

      const data = await response.json();

      if (data.success) {
        setStatus('success');
        setMessage('Thanks! Check your email to confirm subscription.');
        setEmail('');
      } else {
        setStatus('error');
        setMessage(data.error || 'Something went wrong. Please try again.');
      }
    } catch (error) {
      setStatus('error');
      setMessage('Network error. Please try again.');
    }
  };

  return (
    <div className="bg-gradient-to-br from-[#667eea] to-[#764ba2] rounded-2xl px-6 py-12 md:px-8 text-white text-center my-12">
      <h3 className="text-[length:var(--text-2xl)] font-bold mb-3">
        Get Monthly Market Reports
      </h3>
      <p className="text-[length:var(--text-base)] mb-6 opacity-90">
        Top 10 minifigs that increased in value, market trends, and pricing tips delivered monthly.
      </p>

      {status === 'success' ? (
        <div className="px-6 py-4 bg-white/20 rounded-lg text-[length:var(--text-sm)]">
          ✓ {message}
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="flex flex-wrap gap-3 max-w-[500px] mx-auto justify-center">
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="your@email.com"
            required
            disabled={status === 'loading'}
            className="flex-1 min-w-[250px] px-5 py-3.5 rounded-lg border-0 text-[length:var(--text-base)] outline-none text-gray-900"
          />
          <button
            type="submit"
            disabled={status === 'loading'}
            className="px-8 py-3.5 bg-white text-[#667eea] border-0 rounded-lg text-[length:var(--text-base)] font-semibold cursor-pointer transition-all duration-200 disabled:opacity-60 disabled:cursor-not-allowed hover:bg-gray-50"
          >
            {status === 'loading' ? 'Subscribing...' : 'Subscribe Free'}
          </button>
        </form>
      )}

      {status === 'error' && (
        <p className="mt-3 text-[length:var(--text-sm)] text-red-200">
          {message}
        </p>
      )}

      <p className="mt-4 text-[length:var(--text-xs)] opacity-70">
        No spam. Unsubscribe anytime. We respect your privacy.
      </p>
    </div>
  );
}

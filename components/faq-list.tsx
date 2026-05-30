'use client';

import { ChevronDownIcon } from '@heroicons/react/24/outline';
import { useRef } from 'react';

interface FAQ {
  question: string;
  answer: string;
}

interface FAQListProps {
  faqs: FAQ[];
}

export default function FAQList({ faqs }: FAQListProps) {
  const detailsRefs = useRef<(HTMLDetailsElement | null)[]>([]);

  const handleToggle = (index: number, event: React.SyntheticEvent<HTMLDetailsElement>) => {
    const isOpening = event.currentTarget.open;

    // Only close other items if this one is being opened
    if (isOpening) {
      detailsRefs.current.forEach((details, i) => {
        if (details && i !== index && details.open) {
          details.open = false;
        }
      });
    }
  };

  return (
    <div className="flex flex-col">
      {faqs.map((faq, index) => (
        <details
          key={index}
          ref={(el) => {
            detailsRefs.current[index] = el;
          }}
          className="border-b border-[#e5e5e5] group"
          style={{ paddingTop: '32px', paddingBottom: '32px' }}
          onToggle={(e) => handleToggle(index, e)}
        >
          <summary className="text-[length:var(--text-lg)] font-semibold text-[#171717] cursor-pointer list-none flex justify-between items-start" style={{ gap: '24px' }}>
            <span className="flex-1">{faq.question}</span>
            <ChevronDownIcon style={{ width: '20px', height: '20px', minWidth: '20px', minHeight: '20px', maxWidth: '20px', maxHeight: '20px', color: '#737373', flexShrink: '0', transition: 'transform 0.2s' }} className="group-open:rotate-180" />
          </summary>
          <p style={{ marginTop: '16px', fontSize: 'var(--text-base)', color: '#525252', lineHeight: '1.7' }}>
            {faq.answer}
          </p>
        </details>
      ))}
    </div>
  );
}

'use client';

import Script from 'next/script';
import { useState } from 'react';
import { ChevronDownIcon } from '@heroicons/react/24/outline';

interface MinifigFAQProps {
  minifigNo: string;
  minifigName: string;
  categoryName: string;
  yearReleased: string | null;
  suggestedPrice: number;
  currencyCode: string;
}

export default function MinifigFAQ({
  minifigNo,
  minifigName,
  categoryName,
  yearReleased,
  suggestedPrice,
  currencyCode
}: MinifigFAQProps) {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  const faqs = [
    {
      question: `What is ${minifigNo} worth?`,
      answer: suggestedPrice > 0
        ? `Based on current BrickLink marketplace data, ${minifigName} (${minifigNo}) is worth approximately $${suggestedPrice.toFixed(2)} ${currencyCode}. Prices vary by condition (new vs used) and seller location. Use FigTracker to see real-time pricing trends and historical data.`
        : `${minifigName} (${minifigNo}) pricing data is currently unavailable. This may mean the minifigure is extremely rare with no active listings, or pricing data hasn't been fetched yet. Try refreshing the page or check BrickLink directly.`
    },
    {
      question: `Where can I buy ${minifigNo}?`,
      answer: `You can buy ${minifigName} from BrickLink (largest LEGO aftermarket), eBay (wide selection), or Amazon (convenient shipping). Use the buy buttons above to search current listings. Always check seller ratings and compare prices across platforms before purchasing.`
    },
    {
      question: `Is ${minifigNo} rare?`,
      answer: yearReleased
        ? `${minifigName} was released in ${yearReleased} as part of the ${categoryName} theme. Rarity depends on original production numbers, set inclusion, and collector demand. Check the "From These Sets" section above to see which LEGO sets included this minifigure. Fewer sets = usually rarer.`
        : `${minifigName} is from the ${categoryName} theme. Rarity depends on original production numbers and collector demand. Check the "From These Sets" section to see which sets included this minifigure.`
    },
    {
      question: `How do I track ${minifigNo} price changes?`,
      answer: `Add ${minifigName} to your collection or inventory on FigTracker to automatically track price changes. You'll see historical price charts showing 6-month trends and current market averages. Sign in (free) and click "Add to Collection" above to start tracking.`
    }
  ];

  // Schema.org FAQPage for SEO
  const faqSchema = {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: faqs.map(faq => ({
      '@type': 'Question',
      name: faq.question,
      acceptedAnswer: {
        '@type': 'Answer',
        text: faq.answer
      }
    }))
  };

  return (
    <>
      <Script
        id="faq-schema"
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }}
      />
      <div style={{
        marginTop: '48px',
        padding: '24px',
        backgroundColor: '#ffffff',
        borderRadius: '12px',
        boxShadow: '0 1px 3px rgba(0,0,0,0.1)'
      }}>
        <h2 style={{
          fontSize: 'var(--text-2xl)',
          fontWeight: 700,
          color: '#171717',
          marginBottom: '16px'
        }}>
          Frequently Asked Questions
        </h2>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
          {faqs.map((faq, index) => (
            <div
              key={index}
              style={{
                borderBottom: index < faqs.length - 1 ? '1px solid #e5e5e5' : 'none',
                paddingBottom: '12px'
              }}
            >
              <button
                onClick={() => setOpenIndex(openIndex === index ? null : index)}
                style={{
                  width: '100%',
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  padding: '12px 0',
                  background: 'none',
                  border: 'none',
                  cursor: 'pointer',
                  textAlign: 'left'
                }}
              >
                <h3 style={{
                  fontSize: 'var(--text-lg)',
                  fontWeight: 600,
                  color: '#171717',
                  margin: 0
                }}>
                  {faq.question}
                </h3>
                <ChevronDownIcon
                  style={{
                    width: '20px',
                    height: '20px',
                    color: '#737373',
                    transform: openIndex === index ? 'rotate(180deg)' : 'rotate(0deg)',
                    transition: 'transform 0.2s'
                  }}
                />
              </button>
              {openIndex === index && (
                <p style={{
                  fontSize: 'var(--text-base)',
                  color: '#525252',
                  lineHeight: 1.6,
                  marginTop: '8px',
                  paddingLeft: '0'
                }}>
                  {faq.answer}
                </p>
              )}
            </div>
          ))}
        </div>
      </div>
    </>
  );
}

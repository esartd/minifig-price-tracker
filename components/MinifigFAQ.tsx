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

  // Determine age category for context
  const currentYear = new Date().getFullYear();
  const releaseYear = yearReleased ? parseInt(yearReleased) : null;
  const age = releaseYear ? currentYear - releaseYear : null;
  const isVintage = age !== null && age >= 15; // Pre-2010
  const isRecent = age !== null && age <= 3;

  // Price tier for context
  const isExpensive = suggestedPrice > 50;
  const isMidRange = suggestedPrice >= 10 && suggestedPrice <= 50;
  const isBudget = suggestedPrice > 0 && suggestedPrice < 10;

  const faqs = [
    {
      question: `Should I buy ${minifigNo} new or used?`,
      answer: suggestedPrice > 0
        ? `For ${minifigName}, the decision depends on your budget and purpose. New condition typically costs 20-40% more but guarantees pristine print quality and no wear. Used condition is more affordable and perfectly fine for personal collections or MOCs. ${isExpensive ? `At $${suggestedPrice.toFixed(2)}, consider used to save significantly—just verify the print quality in photos.` : isBudget ? `At $${suggestedPrice.toFixed(2)}, new is often worth the small premium for perfect condition.` : `Compare new vs used prices on BrickLink—sometimes the difference is minimal.`} Always check seller photos for print fading, arm cracks, or torso stress marks before buying used.`
        : `Without current pricing data, check BrickLink to compare new vs used prices for ${minifigName}. Generally, buy new if the price difference is less than $5, or if you're investing for resale. Buy used if you're building a personal collection and can tolerate minor wear.`
    },
    {
      question: `Why is ${minifigNo} ${isExpensive ? 'so expensive' : isBudget ? 'so affordable' : 'priced this way'}?`,
      answer: (() => {
        if (isExpensive) {
          return `${minifigName} commands a premium price of $${suggestedPrice.toFixed(2)} due to several factors: ${isVintage ? `**Age** - Released in ${yearReleased}, vintage minifigs are harder to find in good condition. ` : ''}**${categoryName} popularity** - High demand from collectors. **Limited availability** - Likely appeared in few or exclusive sets. ${releaseYear && releaseYear < 2015 ? '**Retired sets** - Original sets are no longer in production. ' : ''}Premium minifigs from exclusive sets, promotional items, or fan-favorite characters always hold higher value.`;
        } else if (isBudget) {
          return `${minifigName} is affordable at $${suggestedPrice.toFixed(2)} because: ${isRecent ? `**Recent release** - Still readily available from ${yearReleased} sets. ` : ''}**Common availability** - Probably included in multiple sets or mass-produced. **Generic design** - Non-character or army-builder minifigs cost less. This makes it perfect for bulk purchases, MOC building, or starting a collection without breaking the bank.`;
        } else {
          return `${minifigName} is moderately priced at $${suggestedPrice.toFixed(2)}, reflecting balanced supply and demand. ${yearReleased ? `Released in ${yearReleased}, ` : ''}it's neither rare enough to be expensive nor common enough to be dirt cheap. Fair pricing makes it accessible for most collectors while maintaining some collectible value.`;
        }
      })()
    },
    {
      question: `What's the best time to buy ${minifigNo}?`,
      answer: `Based on LEGO market trends, the best time to buy ${minifigName} is: ${isRecent ? `**Now, before retirement** - Sets from ${yearReleased} will retire soon, and prices typically spike 30-50% within a year of retirement. ` : isVintage ? `**During off-peak seasons** - Vintage minifigs from ${yearReleased} are cheapest in summer (June-August) when fewer collectors are buying. ` : `**After holiday season** - Prices usually drop in January-February when sellers have excess inventory. `}Avoid buying in November-December (holiday demand) or right after a set retires (speculation spike). Monitor the price history chart above to spot downward trends. Set up price alerts on BrickLink to catch deals below $${(suggestedPrice * 0.9).toFixed(2)}.`
    },
    {
      question: `How can I verify ${minifigNo} is authentic?`,
      answer: `To verify ${minifigName} is genuine LEGO: **1. Check the studs** - All LEGO minifig parts have "LEGO" embossed on studs (top of head, inside torso). **2. Print quality** - LEGO prints are crisp with no bleeding or misalignment. Counterfeits often have blurry prints. **3. Plastic quality** - Real LEGO has a specific feel and clutch power. Fakes are often shinier or flimsier. **4. Color matching** - LEGO's color consistency is perfect. Mismatched yellows or flesh tones indicate fake parts. ${isExpensive ? `For expensive minifigs like this ($${suggestedPrice.toFixed(2)}), ` : ''}Buy from reputable BrickLink sellers with high ratings. If buying on eBay, check if seller has "LEGO" in title and provides close-up photos of LEGO stamps.`
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

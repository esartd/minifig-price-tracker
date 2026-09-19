import { MetadataRoute } from 'next'
import { locales } from '@/lib/i18n-subdomain';
import { originFor } from '@/lib/site-domain';

/**
 * Three groups, because the major AI vendors now run TWO crawlers each and the
 * two want opposite answers.
 *
 * `GPTBot` trains a model; `OAI-SearchBot` and `ChatGPT-User` fetch a page
 * because a person just asked a question. Same for `ClaudeBot` vs
 * `Claude-SearchBot`, and `Amazonbot` vs `Amzn-SearchBot`. The training half
 * crawls relentlessly and refers nobody -- Anthropic's crawler peaked near
 * 70,900 pages fetched per visitor sent, against roughly 5:1 for Googlebot.
 * The answering half fetches only what someone asked about, and those visitors
 * convert several times better than organic search.
 *
 * So: block what takes, allow what sends. This file previously blocked both
 * halves indiscriminately -- `ChatGPT-User` and `PerplexityBot` were in the
 * disallow list, which shut off the one AI channel worth having.
 *
 * Two entries that look wrong and are not:
 *
 *  - `Applebot` is in the SEARCH group, not the AI group. It feeds Siri and
 *    Spotlight; `Applebot-Extended` is the training opt-out and is blocked.
 *    Blocking bare Applebot would be like blocking Bing. It was previously
 *    absent from every group and fell through to `*`, which is why it crawled
 *    33,700 pages in a day unremarked.
 *  - `Amzn-SearchBot` is allowed while `Amazonbot` is blocked. Amazon
 *    documents the first as Alexa/Rufus search that does not train models.
 *
 * Note this file is only a request. Amazonbot is listed below and ignored it
 * completely, so enforcement lives in the Cloudflare WAF; keep the two in step.
 */
export default function robots(): MetadataRoute.Robots {
  // Applied to everything we let in: private areas nobody should index.
  const privateAreas = [
    '/api/',
    '/admin/',
    '/collection/',
    '/inventory/',
    '/sets-collection/',
    '/sets-inventory/',
  ];

  return {
    rules: [
      // 1. Crawlers that harvest to train models, plus SEO scrapers. These
      //    spend our CPU and send nobody.
      {
        userAgent: [
          'GPTBot',
          'CCBot',
          'anthropic-ai',
          'Claude-Web',
          'ClaudeBot',
          'cohere-ai',
          'Omgilibot',
          'FacebookBot',
          'Applebot-Extended',
          'Google-Extended',
          'Bytespider',
          'Diffbot',
          'ImagesiftBot',
          'Amazonbot',
          'PetalBot',
          'AhrefsBot',
          'SemrushBot',
          'DotBot',
          'MJ12bot',
          'BLEXBot',
        ],
        disallow: ['/'],
      },
      // 2. Bots that fetch a page to answer a question someone just asked, and
      //    cite the source. This is a referral channel, so treat it like a
      //    search engine.
      {
        userAgent: [
          'OAI-SearchBot',
          'ChatGPT-User',
          'Claude-SearchBot',
          'Claude-User',
          'PerplexityBot',
          'Perplexity-User',
          'Amzn-SearchBot',
          'MistralAI-User',
          'DuckAssistBot',
        ],
        allow: '/',
        disallow: privateAreas,
      },
      // 3. Search engines. Applebot belongs here — see the note above.
      {
        userAgent: [
          'Googlebot',
          'Bingbot',
          'DuckDuckBot',
          'Slurp',
          'Baiduspider',
          'YandexBot',
          'Applebot',
        ],
        allow: '/',
        disallow: privateAreas,
      },
      // 4. Everything else.
      {
        userAgent: '*',
        allow: '/',
        disallow: [...privateAreas, '/_next/', '/favicon.ico'],
      },
    ],
    // One sitemap per locale, hostnames from lib/site-domain.ts.
    sitemap: locales.map((locale) => `${originFor(locale)}/sitemap.xml`),
  }
}

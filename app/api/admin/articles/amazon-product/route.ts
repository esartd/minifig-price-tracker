import { NextRequest, NextResponse } from 'next/server';

export const runtime = 'edge';


export async function POST(request: NextRequest) {
  try {
    const { url } = await request.json();

    if (!url) {
      return NextResponse.json({ error: 'URL is required' }, { status: 400 });
    }

    // Extract ASIN from various Amazon URL formats
    const asinMatch = url.match(/\/dp\/([A-Z0-9]{10})|\/gp\/product\/([A-Z0-9]{10})/);
    let asin = asinMatch?.[1] || asinMatch?.[2];

    // Handle short links (amzn.to)
    if (!asin && url.includes('amzn.to')) {
      // Follow redirect to get full URL
      const response = await fetch(url, {
        redirect: 'follow',
        headers: {
          'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.114 Safari/537.36'
        }
      });
      const fullUrl = response.url;
      const fullAsinMatch = fullUrl.match(/\/dp\/([A-Z0-9]{10})|\/gp\/product\/([A-Z0-9]{10})/);
      asin = fullAsinMatch?.[1] || fullAsinMatch?.[2];
    }

    if (!asin) {
      return NextResponse.json({ error: 'Could not extract ASIN from URL' }, { status: 400 });
    }

    // Construct clean product URL
    const productUrl = `https://www.amazon.com/dp/${asin}`;

    // Fetch product page
    const response = await fetch(productUrl, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.114 Safari/537.36',
        'Accept': 'text/html',
        'Accept-Language': 'en-US,en;q=0.9',
      }
    });

    if (!response.ok) {
      throw new Error('Failed to fetch product page');
    }

    const html = await response.text();

    // Extract product title
    let title = '';
    const titleMatch = html.match(/<span id="productTitle"[^>]*>\s*([^<]+)\s*<\/span>/i);
    if (titleMatch) {
      title = titleMatch[1].trim();
    }

    // Extract product image
    let imageUrl = '';
    const imageMatch = html.match(/"landingImageUrl":"([^"]+)"/i) ||
                      html.match(/"hiRes":"([^"]+)"/i) ||
                      html.match(/<img[^>]+id="landingImage"[^>]+src="([^"]+)"/i);
    if (imageMatch) {
      imageUrl = imageMatch[1].replace(/\\_/g, '_');
    }

    // Extract price
    let price = '';
    const priceMatch = html.match(/<span class="a-price-whole">([^<]+)<\/span>/i) ||
                      html.match(/<span class="a-offscreen">\$?([0-9,]+\.?[0-9]*)<\/span>/i);
    if (priceMatch) {
      price = '$' + priceMatch[1].replace(/[^0-9.]/g, '');
    }

    return NextResponse.json({
      asin,
      title: title || 'Product Title Not Found',
      imageUrl: imageUrl || '',
      price: price || '',
    });

  } catch (error) {
    console.error('Amazon product fetch error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch product information' },
      { status: 500 }
    );
  }
}

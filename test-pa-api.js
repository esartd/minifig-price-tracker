const crypto = require('crypto');

const ACCESS_KEY = process.env.AMAZON_ACCESS_KEY_ID || 'AKPA7WBUJF1778079109';
const SECRET_KEY = process.env.AMAZON_SECRET_ACCESS_KEY || 'cGQ0nW6NxdeaGUA6Sm0h1NfOYerZOj6th2Ow';
const PARTNER_TAG = process.env.AMAZON_ASSOCIATE_TAG || 'ericksu0c-20';
const HOST = 'webservices.amazon.com';
const REGION = 'us-east-1';
const SERVICE = 'ProductAdvertisingAPI';

function generateSignature(method, path, queryString, payload, timestamp, date) {
  const canonicalRequest = [
    method,
    path,
    queryString,
    `content-type:application/json; charset=utf-8\nhost:${HOST}\nx-amz-date:${timestamp}\nx-amz-target:com.amazon.paapi5.v1.ProductAdvertisingAPIv1.SearchItems`,
    'content-type;host;x-amz-date;x-amz-target',
    crypto.createHash('sha256').update(payload).digest('hex'),
  ].join('\n');

  const stringToSign = [
    'AWS4-HMAC-SHA256',
    timestamp,
    `${date}/${REGION}/${SERVICE}/aws4_request`,
    crypto.createHash('sha256').update(canonicalRequest).digest('hex'),
  ].join('\n');

  const kDate = crypto.createHmac('sha256', `AWS4${SECRET_KEY}`).update(date).digest();
  const kRegion = crypto.createHmac('sha256', kDate).update(REGION).digest();
  const kService = crypto.createHmac('sha256', kRegion).update(SERVICE).digest();
  const kSigning = crypto.createHmac('sha256', kService).update('aws4_request').digest();

  return crypto.createHmac('sha256', kSigning).update(stringToSign).digest('hex');
}

async function testPaApi() {
  console.log('🔍 Testing Amazon PA-API credentials...\n');
  console.log('Access Key:', ACCESS_KEY);
  console.log('Partner Tag:', PARTNER_TAG);
  console.log('Region:', REGION);
  console.log('\n---\n');

  const now = new Date();
  const timestamp = now.toISOString().replace(/[:-]|\.\d{3}/g, '');
  const date = timestamp.slice(0, 8);

  const payload = JSON.stringify({
    Keywords: 'LEGO 75192 Millennium Falcon',
    SearchIndex: 'Toys',
    ItemCount: 1,
    Resources: ['ItemInfo.Title', 'Offers.Listings.Price'],
    PartnerTag: PARTNER_TAG,
    PartnerType: 'Associates',
    Marketplace: 'www.amazon.com',
  });

  const signature = generateSignature('POST', '/paapi5/searchitems', '', payload, timestamp, date);
  const authorization = `AWS4-HMAC-SHA256 Credential=${ACCESS_KEY}/${date}/${REGION}/${SERVICE}/aws4_request, SignedHeaders=content-type;host;x-amz-date;x-amz-target, Signature=${signature}`;

  console.log('🚀 Making PA-API request...\n');

  try {
    const response = await fetch(`https://${HOST}/paapi5/searchitems`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json; charset=utf-8',
        Host: HOST,
        'X-Amz-Date': timestamp,
        'X-Amz-Target': 'com.amazon.paapi5.v1.ProductAdvertisingAPIv1.SearchItems',
        Authorization: authorization,
      },
      body: payload,
    });

    const responseText = await response.text();
    console.log('Response Status:', response.status);
    console.log('Response Body:', responseText);
    console.log('\n---\n');

    if (!response.ok) {
      const errorData = JSON.parse(responseText);

      if (errorData.__type === 'com.amazon.paapi5#InvalidPartnerTag') {
        console.log('❌ ERROR: Invalid Partner Tag');
        console.log('Your Associate Tag "' + PARTNER_TAG + '" is not recognized.');
        console.log('\n✅ FIX: Go to Amazon Associates → Account Settings → Check your Associate ID');
      } else if (errorData.__type === 'com.amazon.paapi5#InvalidSignature' || errorData.__type === 'com.amazon.paapi5#SignatureDoesNotMatch') {
        console.log('❌ ERROR: Invalid Signature');
        console.log('Your Access Key or Secret Key is incorrect.');
        console.log('\n✅ FIX: Generate new credentials in AWS IAM Console');
      } else if (errorData.__type === 'com.amazon.paapi5#AccessDenied' || errorData.__type === 'com.amazon.paapi5#AccessDeniedException') {
        console.log('❌ ERROR: Access Denied');
        console.log('You don\'t have Product Advertising API access yet.');
        console.log('\n✅ FIX: Apply for PA-API access at:');
        console.log('https://affiliate-program.amazon.com/ → Tools → Product Advertising API');
      } else if (errorData.__type === 'com.amazon.paapi5#UnrecognizedClient' || errorData.__type === 'com.amazon.paapi5#InvalidClientTokenId') {
        console.log('❌ ERROR: Unrecognized Client');
        console.log('Your AWS Access Key ID is not valid or not yet active.');
        console.log('\n✅ WAIT: New credentials take 4-24 hours to activate');
        console.log('Created:', new Date('2026-05-06T14:51:00Z').toLocaleString());
        console.log('Check again after:', new Date('2026-05-07T14:51:00Z').toLocaleString());
      } else {
        console.log('❌ ERROR:', errorData.__type || 'Unknown error');
        console.log('Message:', errorData.message || responseText);
      }
    } else {
      const data = JSON.parse(responseText);
      console.log('✅ SUCCESS! PA-API is working!');
      console.log('Found', data.SearchResult?.Items?.length || 0, 'items');
      if (data.SearchResult?.Items?.[0]) {
        console.log('First result:', data.SearchResult.Items[0].ItemInfo?.Title?.DisplayValue);
      }
    }
  } catch (error) {
    console.error('❌ Network Error:', error.message);
  }
}

testPaApi();

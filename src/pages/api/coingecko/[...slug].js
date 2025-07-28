export default async function handler(req, res) {
  const { slug = [] } = req.query;
  const queryString = req.url.split('?')[1] ? '?' + req.url.split('?')[1] : '';
  const coingeckoPath = '/' + slug.join('/') + queryString;
  const apiUrl = `https://api.coingecko.com${coingeckoPath}`;

  // Set cache headers for better performance
  // Different cache times for different endpoints
  const isGlobalData = coingeckoPath.includes('/global');
  const isTrendingData = coingeckoPath.includes('/trending');
  const isMarketData = coingeckoPath.includes('/markets');
  
  let cacheTime = 60; // 1 minute default
  if (isGlobalData) cacheTime = 300; // 5 minutes for global data
  if (isTrendingData) cacheTime = 180; // 3 minutes for trending
  if (isMarketData) cacheTime = 120; // 2 minutes for market data
  
  res.setHeader('Cache-Control', `public, max-age=${cacheTime}, s-maxage=${cacheTime}`);

  try {
    const response = await fetch(apiUrl, {
      method: req.method,
      headers: {
        'Accept': 'application/json',
      },
      // Add timeout to prevent hanging requests
      signal: AbortSignal.timeout(15000), // 15 seconds timeout
    });
    
    const contentType = response.headers.get('content-type');
    res.statusCode = response.status;
    
    if (contentType && contentType.includes('application/json')) {
      const data = await response.json();
      
      // Add ETag for better caching
      const etag = Buffer.from(JSON.stringify(data)).toString('base64');
      res.setHeader('ETag', etag);
      res.setHeader('Content-Type', 'application/json');
      res.end(JSON.stringify(data));
    } else {
      const text = await response.text();
      res.setHeader('Content-Type', contentType || 'text/plain');
      res.end(text);
    }
  } catch (error) {
    console.error('CoinGecko Proxy Error:', error);
    
    // If it's a timeout error, return a more specific message
    if (error.name === 'AbortError') {
      res.statusCode = 408;
      res.end(JSON.stringify({ 
        error: 'Request timeout - CoinGecko API took too long to respond',
        detail: error.message 
      }));
      return;
    }
    
    // Handle 431 error (Request Header Fields Too Large)
    if (error.message && error.message.includes('431')) {
      res.statusCode = 431;
      res.end(JSON.stringify({ 
        error: 'Request header fields too large - please try again',
        detail: 'The request headers exceeded the server limit'
      }));
      return;
    }
    
    res.statusCode = 500;
    res.end(JSON.stringify({ error: 'Proxy error', detail: error.message }));
  }
} 